# CUSAT Grade Card Fetcher

The CUSAT Grade Card Fetcher is a command-line tool designed to automate the process of fetching grade cards for Cochin University of Science and Technology (CUSAT) students. This tool only supports fetching grade cards specifically for Old B.Tech students before the KTU scheme was introduced. It simplifies the task of downloading grade card PDFs for specified roll numbers, focusing solely on the results available at [http://exam.cusat.ac.in/erp5/cusat/Cusat-Home/home_oldresults#](http://exam.cusat.ac.in/erp5/cusat/Cusat-Home/home_oldresults#). This is the only source of data supported by this tool.

## Prerequisites

- Node.js (v20 or newer recommended)
- npm (Node Package Manager)

## Installation

You do not need to install the package locally if you prefer using `npx`. However, if you wish to install it globally on your system, you can do so using npm with the following command:

```bash
npm install -g cusat-grade-card-fetcher
```

## Usage

### Using npx (No Installation Required)

To use the tool without installing it, you can run it directly using `npx`:

```bash
npx cusat-grade-card-fetcher --rollNumber <YourRollNumber> --path <PathToSavePDFs>
```

### Using Globally Installed Package

If you have installed the package globally, you can run it directly from the command line:

```bash
cusat-grade-card-fetcher --rollNumber <YourRollNumber> --path <PathToSavePDFs>
```

### Options

- `--rollNumber` (required): Specifies the roll number of the student for whom you want to fetch the grade cards. Note that this tool is now tailored to fetch grade cards for Old B.Tech students before the introduction of the KTU scheme.
- `--path` (optional): Specifies the directory path where the PDFs will be saved. Defaults to the current directory.

## Features

- **Supports Old B.Tech Students**: Fetches grade cards specifically for Old B.Tech students before the KTU scheme, based on the results available at the specified link.
- Saves grade cards as PDF files in a specified directory.
- Utilizes headless browsing for automation.
- Provides progress feedback through the CLI.

## Examples

Fetching grade cards for roll number 123456 and saving them in the current directory:

```bash
npx cusat-grade-card-fetcher --rollNumber 123456
```

Fetching grade cards for roll number 123456 and saving them in a specified directory:

```bash
npx cusat-grade-card-fetcher --rollNumber 123456 --path /path/to/save
```

## License and Usage Restrictions

This project, the CUSAT Grade Card Fetcher, is provided under the GNU General Public License v3.0 (GPL-3.0) with the following additional usage restrictions:

**Personal Use Only**: This tool is intended solely for the personal use of Cochin University of Science and Technology (CUSAT) students, specifically for fetching grade cards for Old B.Tech courses before the KTU scheme. Any use of this tool for commercial purposes is strictly prohibited. This includes, but is not limited to, using the tool to fetch grade cards for others for a fee, integrating this tool into commercial software or services, and distributing modified versions of this tool for commercial gain.

**Compliance Required**: Users must comply with the terms of the GNU General Public License v3.0, as well as these additional restrictions. Failure to adhere to these terms may result in revocation of your right to use this tool.

For more information on the GNU General Public License v3.0, please visit <https://www.gnu.org/licenses/gpl-3.0.html>.

By using this tool, you acknowledge and agree to these terms and conditions. If you have any questions or concerns about these restrictions, please contact the development team through the GitHub repository.

## Contributions

Contributions are welcome! Please open an issue or submit a pull request with your changes or fixes.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
