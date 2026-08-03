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

## NetSuite TBA Secrets & GitHub Repository Configuration

To enable automated deployment via GitHub Actions, configure the following 6 secrets in your GitHub Repository under **Settings > Secrets and variables > Actions > New repository secret**.

### Required Secrets Summary

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `NS_ACCOUNT` | NetSuite Account ID (Use uppercase, replace hyphen with underscore for sandbox) | `1234567` or `1234567_SB1` |
| `NS_AUTH_ID` | Custom authentication alias for the token | `github_ci_auth` |
| `NS_CONSUMER_KEY` | Integration Record Client ID / Consumer Key | `a1b2c3d4e5f6...` |
| `NS_CONSUMER_SECRET` | Integration Record Client Secret / Consumer Secret | `f6e5d4c3b2a1...` |
| `NS_TOKEN_ID` | User Access Token ID | `9876543210...` |
| `NS_TOKEN_SECRET` | User Access Token Secret | `0123456789...` |

---

## How to Retrieve the 6 NetSuite TBA Secrets

### Step 1: Obtain NetSuite Account ID (`NS_ACCOUNT`)
1. Log in to NetSuite as an Administrator.
2. Navigate to **Setup > Company > Company Information**.
3. Locate the **Account ID** field.
   - For Production: e.g., `1234567`
   - For Sandbox: e.g., `1234567_SB1` (Note: Replace hyphens with underscores, e.g., `1234567-sb1` becomes `1234567_SB1`).

### Step 2: Create Integration Record (`NS_CONSUMER_KEY` & `NS_CONSUMER_SECRET`)
1. Navigate to **Setup > Integration > Manage Integrations > New**.
2. Set **Name** to `GitHub Actions SDF Deployment`.
3. Set **State** to `Enabled`.
4. Under **Authentication**:
   - Check **Token-based Authentication (TBA)**.
   - Uncheck **TBA: Authorization Code Grant**.
   - Check **User Event and Suitelet Script Deployment** (if applicable).
5. Click **Save**.
6. **IMPORTANT**: Immediately copy and store the **Consumer Key** (`NS_CONSUMER_KEY`) and **Consumer Secret** (`NS_CONSUMER_SECRET`). They are displayed only once upon saving.

### Step 3: Create Access Token (`NS_TOKEN_ID` & `NS_TOKEN_SECRET`)
1. Ensure the target User/Role has permissions for **SuiteApp Deployment**, **User Access Tokens**, and required custom record/script permissions.
2. Navigate to **Setup > Users/Roles > Access Tokens > New**.
3. Select the **Application Name** created in Step 2 (`GitHub Actions SDF Deployment`).
4. Select the **Role** (e.g., `Administrator` or a custom DevOps role with SDF permissions).
5. Select the **User**.
6. Set **Token Name** (e.g., `GitHub Actions Deploy Token`).
7. Click **Save**.
8. **IMPORTANT**: Immediately copy and store the **Token ID** (`NS_TOKEN_ID`) and **Token Secret** (`NS_TOKEN_SECRET`). They are displayed only once.

### Step 4: Define AuthID (`NS_AUTH_ID`)
- `NS_AUTH_ID` is an arbitrary unique string alias assigned to store the token credentials locally and in CI/CD (e.g., `github_ci_auth` or `prod_account`).

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
