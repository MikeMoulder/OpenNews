# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with backend-frontend architecture
- FastAPI-based REST API for news analysis
- Next.js frontend with React 19
- OpenGradient LLM integration for news sentiment analysis
- RSS feed parsing capability
- CORS middleware configuration
- Dark mode support with next-themes
- Tailwind CSS styling

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [0.1.0] - 2026-04-03

### Added
- Project initialization
- Basic project structure with backend and frontend separation
- Environment configuration examples
- Development setup documentation
- API documentation with Swagger/ReDoc

---

## Versioning Guide

### Version Format: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes, significant feature releases
- **MINOR**: New features, non-breaking changes
- **PATCH**: Bug fixes, minor improvements

### Release Process

1. Update version in `package.json` (frontend) and `pyproject.toml` or setup.py (backend)
2. Update `CHANGELOG.md` with version number and date
3. Create a git tag: `git tag v0.1.0`
4. Push tag: `git push origin v0.1.0`
5. Create GitHub release with changelog summary

### Unreleased Changes

During development, add changes to the `## [Unreleased]` section:
- Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
- Keep entries brief and user-focused
- Reference PR numbers when applicable: "Add feature (#123)"
