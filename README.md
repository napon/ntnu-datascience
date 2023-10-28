# Data Driven Travel 🇹🇭

### About
This repository contains all the source code and dataset used in the NTNU Datascience course midterm project. The demo is available at: [https://ntnu-ds.napontaratan.com]()

#### Folder Structure

* `env` contains the Python virtual environment
* `datasets` contains all the datasets used
* `data-driven-travel` Web UI for the data visualization
* `process_data.ipynb` Jupyter Notebook used to perform data cleaning and transformation and output to `data-driven-travel/src/data/output.json` to be read by the UI

### Dataset used

1. Historical rainfall data per province per month
2. Historical number of domestic tourist per province per month
3. Historical ratio of total tourist to local population per province per month

### Scoring algorithm

* The higher rainfall amount the more penalty is applied to the rainfall score.
* The number of domestic tourists is used to determine destinations/events known only to locals, hence the higher the number, the better the score.
* The ratio of tourist to local results in highest score when ratio is closest to 50%, the scoring algorithm uses quadratic formula to penalize the low and high percentages.

The resulting scores from each factor are then multiplied by the pre-determined weights, to determine the final score for a province for a given month.

See `process_data.ipynb` for the actual code.

### Installation

#### Dataset transformation
1. Pre-requisite: Python3
2. Activate environment
`source env/bin/activate`
3. Install dependencies `pip install`
4. Launch Jupyter lab `jupyter lab`
5. Open and run file `process_data.ipynb`

#### Web UI
1. Pre-requisite: Node
2. Install dependencies `npm install`
3. Run `npm run develop`
4. The website should be running on `localhost:8000`
