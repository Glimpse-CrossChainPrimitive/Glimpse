const { expect } = require("chai");
const SHA256 = require('crypto-js/sha256')
const testdata = require("../data/jsonTestData.json");

describe("glimpse", function() {
    let glimpseContractFactory;
    let glimpse;

    beforeEach(async () => {
        glimpseContractFactory = await ethers.getContractFactory("glimpse");
        glimpse = await glimpseContractFactory.deploy();
        await glimpse.deployed();

    });

    describe("Check method verifyGlimpseProof", function () {

        it("Check method verifyGlimpseProof  - 32 tx, proof size n=1", async function () {
         let tx = await glimpse.verifyGlimpseProof(testdata.header2Blocks_after110180, testdata.txProofBlock110180, testdata.secondTxBlock110180, testdata.txIndex1, testdata.difficulty_2);
         const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check method verifyGlimpseProof  - 32 tx, proof size n=2", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.header3Blocks_after110180, testdata.txProofBlock110180, testdata.secondTxBlock110180, testdata.txIndex1, testdata.difficulty_2);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check method verifyGlimpseProof  - 32 tx, proof size n=3", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.header4Blocks_after110180, testdata.txProofBlock110180, testdata.secondTxBlock110180, testdata.txIndex1, testdata.difficulty_2);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check method verifyGlimpseProof  - 32 tx, proof size n=4", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.header5Blocks_after110180, testdata.txProofBlock110180, testdata.secondTxBlock110180, testdata.txIndex1, testdata.difficulty_2);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check mathod verifyGlimpseProof - 32 txs, proof size n=5", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.headers_checkProof_32tx, testdata.txProofBlock110180, testdata.secondTxBlock110180, testdata.txIndex1, testdata.difficulty_2);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check method verifyGlimpseProof - 16 tx, proof size n=5", async function () {
         let tx = await glimpse.verifyGlimpseProof(testdata.headers_checkProof_16tx, testdata.txProofBlock100001, testdata.secondTxBlock100001, testdata.txIndex1, testdata.difficulty_1);
         const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Proof of inclusion in the Merkle Tree - returns true.", async function () {
            const result = await glimpse.computeMerkleRoot(testdata.txProofBlock100000, testdata.firstTxBlock100000, testdata.txIndexBlock100000, testdata.txRootBlock100000_flipped)
            expect(result).to.equal(true);

        })

        it("Proof of non-inclusion in the Merkle Tree - returns false.", async function () {
            const result = await glimpse.computeMerkleRoot(testdata.txProofBlock100000, testdata.firstTxBlock100000_fake, testdata.txIndexBlock100000, testdata.txRootBlock100000_flipped)
            expect(result).to.equal(false);

        })

        it("Check method verifyGlimpseProof  - 2tx, proof size n=1", async function () {
             let tx = await glimpse.verifyGlimpseProof(testdata.hexBlockHeader100008, testdata.txProofBlock100008, testdata.firstTxBlock100008, testdata.txIndex0, testdata.difficulty_1);
             const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check method verifyGlimpseProof - 4tx, proof size n=1 ", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.hexBlockHeader100000, testdata.txProofBlock100000, testdata.firstTxBlock100000, testdata.txIndex0, testdata.difficulty_1);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        //test block 100004 = 6 transactions
        it("Check method verifyGlimpseProof - 8tx, proof size n=1", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.hexBlockHeader100026, testdata.txProofBlock100026, testdata.secondTxBlock100026, testdata.txIndex1, testdata.difficulty_1);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            //console.log(receipt);
        })

        it("Check method verifyGlimpseProof  - 16tx, proof size n=1", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.hexBlockHeader100001, testdata.txProofBlock100001, testdata.secondTxBlock100001, testdata.txIndex1, testdata.difficulty_1);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Check method verifyGlimpseProof  - 32 tx, proof size n=1", async function () {
            let tx = await glimpse.verifyGlimpseProof(testdata.hexBlockHeader110180, testdata.txProofBlock110180, testdata.secondTxBlock110180, testdata.txIndex1, testdata.difficulty_2);
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        })

        it("Reverts if block header size is not of 80 bytes - 4tx, proof size n=1", async function () {
        await expect(glimpse.verifyGlimpseProof(testdata.hexBlockHeader100000_wrongSize, testdata.txProofBlock100000, testdata.firstTxBlock100000, testdata.txIndex0, testdata.difficulty_1)).
        to.be.revertedWith("Invalid header size. It must be of 80 bytes.");
        })

        it("Reverts if the hash is not within the target - 4tx, proof size n=1", async function () {
        await expect(glimpse.verifyGlimpseProof(testdata.hexBlockHeader100000_wrongHash, testdata.txProofBlock100000, testdata.firstTxBlock100000, testdata.txIndex0, testdata.difficulty_1)).
        to.be.revertedWith("The block header hash is not within the target.");
        })

    });

})