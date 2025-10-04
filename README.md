# Flippr Client

Flippr Client is a modern, Vue 3-based flashcard app that makes learning easier with intuitive deck and card management, interactive study sessions, and a seamless user experience.

## Features

### Dashboard Page

- **View Decks**: See all flashcard decks at a glance
- **Search Decks**: Filter decks by title in real-time
- **Empty States**: Helpful messages and illustrations when no decks exist

### Manage Page

- **Edit Deck Titles Inline**: Modify deck names directly from the page
- **Delete Decks**: Remove decks easily with confirmation
- **Manage Cards**: Full CRUD operations on cards
- **Search Cards**: Filter cards by question text
- **Smart Deletion**: Undo card deletions via toast notifications
- **Form Validation**: Character limits and required fields
- **Empty States**: Contextual messages for when the user has no cards or no matching search results

### Study Page

- **Interactive Study Mode**: Review flashcards with flip animations
- **Progress Tracking**: Visual feedback during study sessions

### User Experience

- **Dark Mode**: System-aware theme with manual toggle
- **Toast Notifications**: Real-time feedback for all actions
- **Skeleton Loaders**: Smooth loading states
- **Responsive Design**: Mobile-first layout with Tailwind CSS

## Tech Stack

### Core

- **Vue 3** (3.5.21) - Progressive JavaScript framework
- **TypeScript** (5.8.3) - Type safety and better DX
- **Vite** (7.1.6) - Next-generation frontend tooling
- **Vue Router** (4.5.1) - Official routing solution

### State Management & HTTP

- **Pinia** (3.0.3) - Intuitive state management
- **Axios** (1.12.2) - HTTP client
- **JWT Decode** (4.0.0) - Token handling

### UI & Styling

- **Tailwind CSS** (4.1.13) - Utility-first CSS framework
- **Heroicons** (2.2.0) - Beautiful hand-crafted SVG icons
- **Vue Toastification** (2.0.0-rc.5) - Toast notifications

### Testing & Quality

- **Vitest** (3.2.4) - Blazing fast unit test framework
- **Testing Library** (Vue 8.1.0) - Testing utilities
- **Coverage** (@vitest/coverage-v8) - Code coverage reports

### Code Quality

- **ESLint** (9.35.0) - Linting
- **Prettier** (3.6.2) - Code formatting
- **Husky** (9.1.7) - Git hooks
- **lint-staged** (16.2.3) - Pre-commit linting

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### Installation

Using Make (recommended):

```bash
make install
```

Or using npm directly:

```bash
npm install
```

### Development

Start the development server:

```bash
make dev
```

Or:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
make build
```

Or:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Commands

Run `make help` to see all available commands:

```bash
make install       # Install dependencies
make dev           # Start development server
make build         # Build for production
make test          # Run tests in watch mode
make test-coverage # Run tests with coverage report
make lint          # Lint code with ESLint
make format        # Format code with Prettier
make clean         # Remove build artifacts and dependencies
```

### NPM Scripts

```bash
npm run dev          # Start dev server
npm run build        # Type check + build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run type-check   # Run TypeScript compiler check
npm run test         # Run tests in watch mode
npm run test:ci      # Run tests with coverage (CI)
```

## Project Structure

```
src/
├── assets/          # Static assets (images, SVGs)
├── components/      # Vue components
│   ├── base/        # Reusable base components
│   ├── dashboard/   # Dashboard-specific components
│   ├── layout/      # Layout components (Navbar, etc.)
│   └── manage/      # Deck/card management components
├── composables/     # Vue composables (reusable logic)
├── pages/           # Page components (routes)
├── router/          # Vue Router configuration
├── services/        # API service layer
├── stores/          # Pinia stores (state management)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── test/            # Test files
```

## Development Workflow

### Pre-commit Hooks

This project uses Husky and lint-staged to automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Ensure code quality before commits

### Code Quality

Type checking:

```bash
npm run type-check
```

Linting:

```bash
make lint
```

Formatting:

```bash
make format
```

### Testing

Run tests in watch mode:

```bash
make test
```

Generate coverage report:

```bash
make test-coverage
```

View coverage report by opening `coverage/index.html` in your browser.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_url_here
```

## Key Features Implementation

### Authentication

- JWT-based authentication with session management
- Protected routes with route guards
- Automatic token refresh handling

### State Management

- Centralized state with Pinia stores
- Reactive deck and card management
- Optimistic UI updates

### User Feedback

- Toast notifications for all actions
- Loading states with skeleton screens
- Empty state illustrations and messages
- Undo functionality for destructive actions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.

## Related Repositories

- [Flippr API](../flippr-api) - Backend API server

---

Built with Vue 3 + TypeScript + Vite
