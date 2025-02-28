# Profile Calculator

A JavaScript-based structural profile calculator with comprehensive test suite.

## Features

- Material configuration and validation
- Profile configuration and validation
- Cross-sectional property calculations
- Unit conversion system
- Comprehensive test suite

## Test Suite

The test suite is automatically deployed to GitHub Pages and can be accessed at:
`https://[username].github.io/[repository-name]/`

### Available Tests

1. **Configuration Manager Tests**
   - Tests the central configuration system
   - Validates material and profile configurations
   - Tests caching and validation rules

2. **Profile Calculator Tests**
   - Tests geometric calculations for various profiles
   - Validates cross-sectional properties
   - Tests weight and material calculations

3. **Material Configuration Tests**
   - Tests material property validation
   - Validates grade configurations
   - Tests material metadata

## Development

The project uses a pure JavaScript approach with no build tools required. Tests run directly in the browser via GitHub Pages.

### Project Structure

```
.
├── .github/
│   └── workflows/
│       └── test.yml      # GitHub Actions workflow
├── standalone/
│   ├── js/
│   │   ├── core/
│   │   │   ├── config/   # Configuration modules
│   │   │   └── store/    # Data stores
│   │   └── modules/
│   │       ├── calculations/
│   │       └── profiles/
│   └── test/            # Test files
├── index.html          # Test runner
└── README.md
```

### Running Tests Locally

1. Clone the repository
2. Open `index.html` in your browser
3. Tests will run automatically

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 