var express = require("express");
var router = express.Router();
'use strict';


router.post("/", function(req, res) {
    const newCar = {
        CarID: req.body.carID,
        Make: req.body.make,
        Model: req.body.model,
        Color: req.body.color,
        Owner: req.body.owner

    }

    const stringCar = JSON.stringify(newCar);




    const { FileSystemWallet, Gateway } = require('fabric-network');
    const path = require('path');

    const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');

    async function main() {
        try {

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');

            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
            await contract.submitTransaction('createCar', newCar.ID, newCar.Make, newCar.Model, newCar.Color, newCar.Owner);
            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    main();

});




module.exports = router;