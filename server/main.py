# -- coding: utf-8 --`
import os
from urllib import request
# engine
from stable_diffusion_engine import StableDiffusionEngine
# scheduler
from diffusers import LMSDiscreteScheduler, PNDMScheduler
# utils
import cv2
import numpy as np
from typing import Union
from pydantic import BaseModel
from fastapi import FastAPI, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import BackgroundTasks
import base64
import logging
import requests


class Item(BaseModel):
    model: Union[str, None] = None # model name
    seed: Union[int, None] = None # random seed for generating consistent images per prompt
    beta_start: Union[float, None] =  None # LMSDiscreteScheduler::beta_start
    beta_end: Union[float,None] = None # LMSDiscreteScheduler::beta_end
    beta_schedule: Union[str,None] = None # LMSDiscreteScheduler::beta_schedule
    num_inference_steps: Union[int, None] = None # num inference steps
    guidance_scale: Union[float,None] = None # guidance scale
    eta: Union[float,None] = None # eta
    tokenizer: Union[str,None] = None # tokenizer
    prompt: str  = None# prompt
    init_image: Union[str, None] = None # path to initial image
    strength: Union[float,None] = None # how strong the initial image should be noised [0.0, 1.0]
    mask: Union[str,None] = None # mask of the region to inpaint on the initial image
    output: Union[str,None] = None # output image name

model: Union[str, None] = "bes-dev/stable-diffusion-v1-4-openvino" # model name
seed: Union[int, None] = None # random seed for generating consistent images per prompt
beta_start: Union[float, None] =  0.00085 # LMSDiscreteScheduler::beta_start
beta_end: Union[float,None] = 0.012 # LMSDiscreteScheduler::beta_end
beta_schedule: Union[str,None] = "scaled_linear" # LMSDiscreteScheduler::beta_schedule
num_inference_steps: Union[int, None] = 32 # num inference steps
guidance_scale: Union[float,None] = 7.5 # guidance scale
eta: Union[float,None] = 0.0 # eta
tokenizer: Union[str,None] = "openai/clip-vit-large-patch14" # tokenizer
prompt: str = "icon of a cat" # prompt
init_image: Union[str, None] = None # path to initial image
strength: Union[float,None] = 0.5 # how strong the initial image should be noised [0.0, 1.0]
mask: Union[str,None] = None # mask of the region to inpaint on the initial image
output: Union[str,None] = "output.png" # output image name

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://speed1313.github.io/aicon/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}



@app.post("/generate")
def update_item(item: Item):
    print(item)
    input: str =str(' '.join([item.prompt, "アイコン"]))
    print(input)
    PRIMARY_KEY = os.environ.get("PRIMARY_KEY")
    # send request to https://api.rinna.co.jp/models/tti/v2 HTTP/1.1
    request_url = "https://api.rinna.co.jp/models/tti/v2"
    headers = {"Content-Type": "application/json", "Cache-Control": "no-cache","Ocp-Apim-Subscription-Key": PRIMARY_KEY}
    payload ={
        "prompts": input,
        "scale": 7.5
    }
    result = requests.request("POST", url=request_url, headers=headers, json=payload,timeout=10)
    return {"item_prompt": input, "image": result.json()['image']}

@app.get("/cat")
def reply_cat():
    PRIMARY_KEY = os.environ.get("PRIMARY_KEY")
    # send request to https://api.rinna.co.jp/models/tti/v2 HTTP/1.1
    request_url = "https://api.rinna.co.jp/models/tti/v2"
    headers = {"Content-Type": "application/json", "Cache-Control": "no-cache","Ocp-Apim-Subscription-Key": PRIMARY_KEY}
    payload ={
        "prompts": "icon of a cat",
        "scale": 7.5
    }
    result = requests.request("POST", url=request_url, headers=headers, json=payload,timeout=10)
    return {"image": result.json()['image']}

def generate_icon_image(prompt: str):
    if seed is not None:
        np.random.seed(seed)
    if init_image is None:
        scheduler = LMSDiscreteScheduler(
            beta_start=beta_start,
            beta_end=beta_end,
            beta_schedule=beta_schedule,
            tensor_format="np"
        )
    else:
        scheduler = PNDMScheduler(
            beta_start=beta_start,
            beta_end=beta_end,
            beta_schedule=beta_schedule,
            skip_prk_steps = True,
            tensor_format="np"
        )
    engine = StableDiffusionEngine(
        model = model,
        scheduler = scheduler,
        tokenizer = tokenizer
    )
    image = engine(
        prompt = prompt,
        init_image = None if init_image is None else cv2.imread(init_image),
        mask = None if mask is None else cv2.imread(mask, 0),
        strength = strength,
        num_inference_steps = num_inference_steps,
        guidance_scale = guidance_scale,
        eta = eta
    )
    cv2.imwrite(output, image)

if __name__ =="__main__":
     uvicorn.run(app, host="0.0.0.0", port=8000)