# NetSuite SDF Project & Automated CI/CD Pipeline

This repository contains a NetSuite SuiteCloud Development Framework (SDF) project configured with SuiteScript 2.1 support and an automated GitHub Actions deployment pipeline.

## Project Structure

```text
my-netsuite-sdf-project/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD Pipeline
├── src/
│   ├── FileCabinet/
│   │   └── SuiteScripts/
│   │       └── custom_ue_sample.js # SuiteScript 2.1 User Event Script
│   ├── Objects/
│   │   └── customscript_ue_sample.xml # Custom Script Record Definition XML
│   ├── deploy.xml                  # SDF Deployment Manifest
│   └── manifest.xml                # SDF Project Manifest
├── .gitignore
├── package.json                    # Node.js dependencies (@oracle/suitecloud-cli)
├── project.json                    # SDF Project Configuration
└── README.md
```

---

## NetSuite CI/CD Secrets & GitHub Repository Configuration

To enable automated deployment via GitHub Actions with `@oracle/suitecloud-cli` 3.x, configure the following secrets in your GitHub Repository under **Settings > Secrets and variables > Actions > New repository secret**.

### Required Secrets Summary

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `NS_ACCOUNT` | NetSuite Account ID (Uppercase, replace hyphens with underscores for Sandbox) | `1234567` or `1234567_SB1` |
| `NS_AUTH_ID` | Custom local alias name you choose to label this connection | `GitHubDeployer` or `default` |
| `NS_CERTIFICATE_ID` | Certificate ID generated when setting up OAuth 2.0 Client Credentials in NetSuite | `my_cert_id_123` |
| `NS_PRIVATE_KEY` | Plaintext content of your private RSA key (`.pem`) file matching the uploaded certificate | `-----BEGIN PRIVATE KEY-----\n...` |

---

## What is `NS_AUTH_ID` (e.g., `GitHubDeployer`)?

`NS_AUTH_ID` (such as `GitHubDeployer`) is **not** generated or found inside NetSuite. It is simply an **arbitrary custom label/alias name** that you pick yourself to name your local authentication profile in the CLI.

---

## How to Set Up NetSuite OAuth 2.0 M2M Credentials

### Step 1: Generate an RSA Key Pair locally
```bash
openssl genrsa -out private_key.pem 2048
openssl req -new -x509 -key private_key.pem -out public_key.pem -days 365
```

### Step 2: Create Integration Record & Upload Public Key in NetSuite
1. Navigate to **Setup > Integration > Manage Integrations > New**.
2. Name: `GitHub Actions SDF Deployment`.
3. Check **OAuth 2.0 (Client Credentials Grant)**.
4. Set Scope to **RESTlets, SuiteAnalytics Connect, or SDF** as applicable.
5. Under **OAuth 2.0**, click **Upload Certificate**, select your `public_key.pem`, and save.
6. Copy the generated **Certificate ID** (`NS_CERTIFICATE_ID`).

### Step 3: Configure GitHub Repository Secrets
1. Go to your GitHub Repository > **Settings > Secrets and variables > Actions**.
2. Add `NS_ACCOUNT` (e.g. `1234567` or `1234567_SB1`).
3. Add `NS_AUTH_ID` (e.g. `GitHubDeployer`).
4. Add `NS_CERTIFICATE_ID` (copied from Step 2).
5. Add `NS_PRIVATE_KEY` (paste the entire text content of `private_key.pem`).


---

## Local Setup & Commands

### Prerequisites
- Node.js version 18.x or 20.x installed.
- Oracle SuiteCloud CLI installed globally or via project dependencies.

### 1. Install Dependencies
```bash
npm install --acceptsuitecloudsdklicense
```
> **Note for CI / Global Installation**: When installing in automated CI pipelines or globally (`npm install -g @oracle/suitecloud-cli`), append `--acceptsuitecloudsdklicense` to accept Oracle's Free Use Terms and Conditions license non-interactively.


### 2. Save Token Credential Locally (`npm run setup`)
Run the interactive or non-interactive token save command:

```bash
npx suitecloud account:savetoken --account "YOUR_ACCOUNT_ID" --authid "default" --tokenid "YOUR_TOKEN_ID" --tokensecret "YOUR_TOKEN_SECRET" --consumerkey "YOUR_CONSUMER_KEY" --consumersecret "YOUR_CONSUMER_SECRET"
```

Or run via `npm run setup` interactively:
```bash
npm run setup
```

### 3. Validate Project Locally (`npm run validate`)
To validate the SDF project structure and script XML definitions against your NetSuite account:
```bash
npm run validate
```
Or directly using `npx`:
```bash
npx suitecloud project:validate
```

### 4. Deploy Project Locally (`npm run deploy`)
To deploy the SDF customization bundle to your target NetSuite account:
```bash
npm run deploy
```
Or directly using `npx`:
```bash
npx suitecloud project:deploy
```

---

## GitHub Actions CI/CD Pipeline

The workflow defined in `.github/workflows/deploy.yml` performs the following actions:

- **Pull Requests (PR to `main`)**: Automatically runs `suitecloud project:validate` to catch syntax or XML errors before code is merged.
- **Push to Main**: Automatically runs `suitecloud project:deploy` to apply updates directly to your NetSuite environment.

### Headless CI Storage Mode
In Linux CI runners (where OS desktop keyring/libsecret is unavailable), Token-Based Authentication credentials saved via `suitecloud account:savetoken` use fallback encrypted file storage by defining:
- `SUITECLOUD_FALLBACK_PASSKEY`: A 32-character alphanumeric key used by SuiteCloud CLI to encrypt and decrypt the credentials file in headless environments without requiring OS keyrings.

