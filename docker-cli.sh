#!/bin/bash
cd /app

  rm -rf .next node_modules
  yarn cache clean -f
  yarn install
  yarn start
