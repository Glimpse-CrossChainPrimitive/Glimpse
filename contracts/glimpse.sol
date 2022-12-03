pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2; //returning struct is not fully supported. I need this line to enable it

import "hardhat/console.sol";
import "./BytesLib.sol";

contract glimpse {

    function verifyGlimpseProof(bytes[] memory blockHeaders, bytes32[] memory proof, bytes32 glimpseEvent, uint index, bytes memory difficultyBits) external {

        //compute target
        uint target = getTargetFromBits(difficultyBits);

        //limit the number of elements in the proof to avoid a loop over an unbounded data structure
        require(blockHeaders.length < 11, "Too many blocks in the proof. Up to 11 blocks supported.");

        for(uint ii = 0; ii < blockHeaders.length; ii++ ) {

            //check each header length is of 80 bytes
            require(blockHeaders[ii].length == 80, "Invalid header size. It must be of 80 bytes.");

            // check hash is within the target
            require(BytesLib.bytesToUint(BytesLib.toBytes(computeHeaderHash(blockHeaders[ii]))) < target, "The block header hash is not within the target.");

            if (ii == 0) {
                //verify proof
                require(computeMerkleRoot(proof, glimpseEvent, index, getMerkleRoot(blockHeaders[ii])) == true, "Computed Merkle root does not match with the original's block Merkle root.");
            }
            else {
                //check blocks are chained together via parent hash
                require(getParentHash(blockHeaders[ii]) == computeHeaderHash(blockHeaders[ii-1]), "Parent hash is not equal to previous block hash.");
            }
        }
    }

    function getTargetFromBits(bytes memory bits) private pure returns (uint256){
        uint256 nBits = BytesLib.bytesToUint(BytesLib.flipBytes(bits));
        uint256 exp = nBits >> 24;
        uint256 coeff = nBits & 0xffffff;
        return coeff * 2**(8*(exp - 3));
    }

    /*
    * @notice Retrieve the parent hash from the block header
    * @param Block header
    * @return ParentHash of the block
    */
    function getParentHash(bytes memory blockHeader) private pure returns (bytes32) {
        return BytesLib.flipBytes32(BytesLib.toBytes32(BytesLib.slice(blockHeader, 4, 32)));
    }

    /*
    * @notice Retrieve the parent hash from the block header
    * @param Block header
    * @return ParentHash of the block
    */
    function computeHeaderHash(bytes memory blockHeader) private pure returns (bytes32) {
        return BytesLib.flipBytes32(doubleSHA256(blockHeader));
    }

    /*
    * @notice Compute merkle tree root and check if it matches Bitcoin block's original merkle tree root
    * @param Merkle Proof, the glimpse event whose inclusion has to be checked, index of the tx position, block header (hex format)
    * @return true if the computed Merkle root is equal to the block's original merkle tree root, false otherwise
    * - details on how to compute merkle root in Bitcoin: https://medium.com/@stolman.b/1-4-hashing-transactions-txids-to-find-the-merkle-root-3aa5255f8de8
    */
    function computeMerkleRoot(bytes32[] memory proof, bytes32 glimpseEvent, uint index, bytes32 root) public view returns (bool)
    {
        //limit the number of elements in the proof to avoid a loop over an unbounded data structure
        require(proof.length < 20, "Maximum Merkle proof elements reached: up to 20 elements supported.");
        //flip bytes of the glimpse event
        bytes32 hash = BytesLib.flipBytes32(glimpseEvent);

        //do not do loops on potentially unbounded data structure
        for (uint ii = 0; ii < proof.length; ii++) {

            bytes32 proofElement = proof[ii];
            if (index % 2 == 0) {
                hash = doubleSHA256(hash, proofElement);
            } else {
                hash = doubleSHA256(proofElement, hash);
            }

            index = index / 2;
        }

        hash = BytesLib.flipBytes32(hash);
        return hash == root;
    }

    /*
    * @notice Computes double sha256
    * @param bytes32 value to be hashed
    * @return double hash value
    */
    function doubleSHA256(bytes memory valueToHash) private pure returns (bytes32) {
        return sha256(abi.encodePacked(sha256(abi.encodePacked(valueToHash))));
    }

    function doubleSHA256(bytes32 value1ToHash, bytes32 value2ToHash) private pure returns (bytes32) {
        return sha256(abi.encodePacked(sha256(abi.encodePacked(value1ToHash, value2ToHash))));
    }

    function getMerkleRoot(bytes memory blockHeader) private pure returns(bytes32){
        return BytesLib.toBytes32(BytesLib.flipBytes(BytesLib.slice(blockHeader, 36, 32)));
    }
}
