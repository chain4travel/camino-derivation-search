# Derivation search script

This script needs a seed phrase and runs through the predefined Camino/Avalanche derivation paths to search for a specific match with a P-Chain address. When it finds a match, it then prints out the derivation path and the respective public/private key for that path.

The script can also be modified to print out more/different paths.

There is a seed phrase pre-defined as an example. This is not a leak but just a random phrase with no funds.

## How to use
* Clone the repository
* Make sure you have nodejs installed
* Install the script dependencies using `npm install`
* Modify the script to put in the seed phrase and P-Chain address to search for
* Execute the script using `npm start`
