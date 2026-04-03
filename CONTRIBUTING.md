# Contributing to OpenNews

Thank you for considering contributing to OpenNews! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/opennews.git
   cd opennews
   ```
3. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Development
```bash
cd frontend
npm install
```

## Making Changes

### Code Style

**Python (Backend)**
- Follow [PEP 8](https://pep8.org/) style guidelines
- Use type hints for function arguments and return types
- Keep functions focused and modular
- Add docstrings to complex functions

**TypeScript/React (Frontend)**
- Follow ESLint configuration in the project
- Use functional components with hooks
- Maintain consistent naming conventions
- Add comments for complex logic

### Commit Messages

Write clear, descriptive commit messages:
- Use imperative mood ("Add feature" not "Added feature")
- Keep first line under 50 characters
- Reference related issues: "Fixes #123" or "Related to #456"

Example:
```
Add crypto sentiment analysis endpoint

- Implement new POST /sentiment endpoint
- Add LLM integration for sentiment classification
- Include proper error handling and validation
- Fixes #789
```

## Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## Pull Request Process

1. **Update** the README.md or relevant documentation with any new features
2. **Test** your changes locally:
   - Backend: Run lint and tests
   - Frontend: Run lint and build
   ```bash
   cd frontend
   npm run lint
   npm run build
   ```

3. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** with:
   - Clear title describing the change
   - Description explaining the "why" and "what"
   - Reference to related issues
   - Screenshots or demos if UI-related

5. **Address feedback** from code reviewers

## Issue Reporting

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- System details (OS, browser, Python/Node versions)
- Screenshots or error logs if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Alternative approaches (optional)

## Project Structure Guidelines

### Backend Structure
```
backend/
├── main.py              # FastAPI app and routes
├── models/              # Pydantic models
├── services/            # Business logic
├── utils/               # Utility functions
└── tests/               # Test files
```

### Frontend Structure
```
frontend/src/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utilities and helpers
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Documentation

- Update README.md for user-facing changes
- Add docstrings to complex functions
- Comment non-obvious logic
- Update CHANGELOG.md for significant changes

## Review Process

- Maintainers will review your PR in a timely manner
- Constructive feedback may be provided
- Approved PRs will be merged by maintainers
- Closed PRs without clear status can be reopened with updates

## Questions?

- Open an issue with the `question` label
- Check existing issues and discussions
- Refer to the project documentation

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Project CONTRIBUTORS file

Thank you for helping make OpenNews better! 🎉
