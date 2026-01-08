# Contributing to Collaborative Whiteboard

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/whiteboard-backend.git
   cd whiteboard-backend
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Setup

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Git

### Running Locally

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Server will run on `http://localhost:8080`

## 🎯 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment:** OS, Node.js version, browser

**Example:**
```
Title: Canvas clear not syncing for all users

Description: When one user clears the canvas, other users in the same room don't see the clear event.

Steps to Reproduce:
1. User A joins room 'test-room'
2. User B joins same room 'test-room'
3. User A draws something
4. User A clicks "Clear Canvas"
5. User B still sees the drawing

Expected: Canvas should clear for all users
Actual: Only clears for user who clicked the button

Environment: macOS 14, Node.js 18, Chrome 120
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

- **Use case:** Why is this feature needed?
- **Proposed solution:** How should it work?
- **Alternatives considered:** Other approaches you thought about
- **Additional context:** Mockups, examples, etc.

### Pull Requests

1. **Create an issue first** for major changes
2. **Follow the code style** (see below)
3. **Write clear commit messages** (see below)
4. **Test your changes** thoroughly
5. **Update documentation** if needed

#### Code Style

- Use **2 spaces** for indentation
- Use **semicolons**
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**
- Follow **MVC pattern** for organization

#### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(drawing): add undo/redo functionality

Implemented command pattern for undo/redo of drawing actions.
Users can now press Ctrl+Z to undo and Ctrl+Y to redo.

Closes #42

---

fix(socket): handle disconnection edge case

Fixed issue where users weren't properly removed from room
when browser was closed without logout.

---

docs(readme): add demo GIF and badges

Added animated GIF showing real-time collaboration and
status badges for build, coverage, and license.
```

## 📋 Development Guidelines

### Project Structure

```
src/
├── models/         # Data models
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/         # API routes
├── middlewares/    # Middleware functions
└── utils/          # Helper functions
```

### Adding a New Feature

1. **Create model** (if needed) in `src/models/`
2. **Add service** logic in `src/services/`
3. **Create controller** in `src/controllers/`
4. **Add routes** in `src/routes/`
5. **Update documentation** in README.md
6. **Add tests** (when testing is set up)

### Testing (Future)

When tests are added:
```bash
npm test
npm run test:coverage
```

## 🎨 Frontend Contributions

For UI/UX improvements:

1. Maintain the **purple gradient theme**
2. Ensure **responsive design**
3. Test on **multiple browsers**
4. Add **touch support** for mobile
5. Keep **accessibility** in mind

## 📝 Documentation

Update documentation when you:
- Add new features
- Change API endpoints
- Modify configuration
- Add new dependencies
- Change deployment process

## 🔍 Code Review Process

1. **Automated checks** will run on PR
2. **Maintainer review** within 48 hours
3. **Address feedback** and update PR
4. **Merge** once approved

## 🌟 Good First Issues

Look for issues labeled:
- `good first issue`
- `beginner friendly`
- `documentation`

## 💡 Feature Ideas

Some ideas for contributions:

### High Priority
- [ ] Add unit and integration tests
- [ ] Implement undo/redo functionality
- [ ] Add user authentication
- [ ] Database persistence (MongoDB/PostgreSQL)

### Medium Priority
- [ ] Export canvas as PNG/SVG
- [ ] Add more drawing tools (arrow, polygon)
- [ ] Implement layers
- [ ] Add chat functionality
- [ ] Cursor tracking for other users

### Nice to Have
- [ ] Mobile app (React Native)
- [ ] Video/voice chat integration
- [ ] Templates system
- [ ] Collaboration analytics
- [ ] Plugin architecture

## 🤝 Community

- **Be respectful** and constructive
- **Help others** in issues and discussions
- **Share knowledge** through documentation
- **Give credit** where it's due

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ⚡ Quick Commands

```bash
# Development
npm run dev          # Start dev server with auto-reload

# Production
npm start           # Start production server

# Docker
docker-compose up   # Run with Docker

# Git
git checkout -b feature/name    # Create feature branch
git add .                       # Stage changes
git commit -m "type: message"   # Commit with message
git push origin feature/name    # Push to your fork
```

## 📧 Questions?

- **Open an issue** for bugs or features
- **Start a discussion** for questions
- **Read the docs:** README.md, DEPLOYMENT.md, TESTING.md

---

Thank you for contributing! 🎉
