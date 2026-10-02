# Security Policy

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Security vulnerabilities should be reported privately to the project maintainers.

A report should include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Relevant logs or screenshots, when safe to share
- Suggested mitigation, if known

## Security Principles

GoBit follows these security principles:

- Never commit API keys, passwords, tokens, or private credentials.
- Keep secrets outside source control.
- Validate user input.
- Authenticate protected API requests.
- Authorize access to user-owned resources.
- Use HTTPS for production communication.
- Minimize collection of sensitive data.
- Request health and location permissions only when required.
- Store sensitive data securely.
- Never expose server-side secrets in the mobile application.
- Keep dependencies maintained.
- Review third-party dependencies before introducing them.

## Sensitive Data

GoBit may eventually process information such as:

- Location data
- Workout history
- Activity metrics
- Health-related metrics
- Authentication information

Features involving sensitive information should follow the project's security and privacy requirements.

## Dependency Security

Dependencies should be reviewed before being added or upgraded.

Avoid using:

```bash
npm audit fix --force