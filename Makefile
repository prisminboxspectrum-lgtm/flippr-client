.PHONY: install dev build test test-coverage lint format clean help

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

test-coverage:
	npm run test:ci

lint:
	npm run lint:fix

format:
	npm run format

clean:
	rm -rf node_modules dist coverage

help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make dev           - Start development server"
	@echo "  make build         - Build for production"
	@echo "  make test          - Run tests in watch mode"
	@echo "  make test-coverage - Run tests with coverage report"
	@echo "  make lint          - Lint code with ESLint"
	@echo "  make format        - Format code with Prettier"
	@echo "  make clean         - Remove build artifacts and dependencies"