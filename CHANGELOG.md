# Changelog

All notable changes to this project will be documented in this file.

## [0.3.8]

### Added
- **Person Search:** Added a new "Search" operation to the Person resource to allow finding net new people.
- **Search Filters:** Implemented extensive filtering capabilities including:
    - Job Titles and Keywords
    - Person and Organization Locations
    - Seniority Levels
    - Organization Domains and IDs
    - Employee Count and Revenue Ranges
    - Contact Email Status

### Changed
- **Input Parsing:** Enhanced list parameter handling to support semicolon separators and automatically filter out empty or invalid entries for more robust API requests.
- **Compliance:** Sorted multi-select options alphabetically to adhere to n8n node linting standards.