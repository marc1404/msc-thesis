#!/usr/bin/env bash

cd api && yarn && cp .env.example .env & cd frontend && yarn && cp .env.example .env & cd beer-scraper && yarn && cp .env.example .env