# Credit Card Approval Predictor

A simulation platform predicting credit card approval, credit limit, and TransUnion CIBIL credit score drivers using a banking underwriting pipeline.

## Features

- **TransUnion CIBIL Scoring Engine**: Mathematical 5-factor score model (300–900 scale) based on Payment History (35%), Credit Exposure/FOIR (30%), Bureau Vintage (15%), Credit Mix (10%), and Recent Inquiries (10%).
- **Multi-Stage Banking Verification**: Bureau scrub, Account Aggregator statement verification, and 50% FOIR ceiling.
- **Dynamic Risk-Based APR**: Interest rates calculated dynamically starting from 9.0% p.a.
- **Card Tier Segmentation**: Classic / Millennial, Select, Wealth, and 100% Guaranteed Secured (FD-Backed) credit cards.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm run dev`

## Author

**MOHD FAIZAN MOHD ANWAR RAHMANI**
- Email: [rahmanifaizan1@gmail.com](mailto:rahmanifaizan1@gmail.com)

