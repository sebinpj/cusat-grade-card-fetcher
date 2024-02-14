# CUSAT Grade Card Fetcher

This tool is designed to automate the process of fetching grade cards for Cochin University of Science and Technology (CUSAT) students. It leverages Puppeteer for browser automation, along with various other utilities for efficient operation and user interaction.

## Features

- **Automated Grade Card Download:** Automatically navigates to the CUSAT results website, searches for the grade cards using the provided roll number, and downloads them.
- **Progress Tracking:** Utilizes `cli-progress` to show progress in the terminal during the download process.
- **Logging:** Implements `pino` and `pino-pretty` for colorful and formatted logging of the process and errors.
- **Command Line Arguments:** Supports custom command line arguments for roll number and destination path using `yargs`.

## Prerequisites

Before you begin, ensure you have Node.js installed on your machine. This script was developed with Node.js version 14.x or higher in mind.

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory and run `npm install` to install the required dependencies.

## Usage

Run the script with the following command:

```bash
node index.js --rollNumber="YourRollNumber" --path="./your/custom/path"
