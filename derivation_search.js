
import { mnemonicToSeedSync, wordlists, validateMnemonic } from 'bip39'
import { BinTools, Buffer } from '@c4tplatform/caminojs/dist/index.js'
import { KeyPair } from '@c4tplatform/caminojs/dist/apis/evm/index.js'
import pkg_hdkey from 'hdkey';
const { fromMasterSeed } = pkg_hdkey;
import pkg_secp from 'secp256k1';
const { privateKeyVerify } = pkg_secp;

/* ##### MODIFY THIS PART TO PUT THE SEED PHRASE AND EXPECTED P-ADDR IN HERE */
const SEED_PHRASE="morning angle pool fire warfare exist pretty blame they private need choose above enable slot crazy near roast risk practice mix much aerobic normal"
// const EXPECTED_PADDR="" // Left empty will print out all the derived addresses (up to PROBE_NUM_DERIVATIONS)
const EXPECTED_PADDR="P-camino1k9x49hf8unnm4qd6ayldw8h77vz5kga8ltw860"
/* ##### END OF MODIFICATION */

const HRP = "camino"
const CAM_DERIVATION_PATH_PREFIX = "m/44'/60'/0'/0/"
const AVAX_DERIVATION_PATH_PREFIX = "m/44'/9000'/0'/0/"

if (!validateMnemonic(SEED_PHRASE, wordlists.english)) {
	console.log("Error validating Mnemonic phrase")
	process.exit(1)
}

const PROBE_NUM_DERIVATIONS = 100

const bintools = BinTools.getInstance()
var hd_key = fromMasterSeed(mnemonicToSeedSync(SEED_PHRASE))

function probeDerivation(hd_key, path_prefix, index, expected_paddr) {
	var derived_key = hd_key.derive(path_prefix + index)
	var private_key = Buffer.from(derived_key.privateKey)
	if (!privateKeyVerify(private_key))
		console.log("Invalid private key")

	var public_key = Buffer.from(derived_key.publicKey)
	const addrBuf = KeyPair.addressFromPublicKey(public_key)
	const p_addr = bintools.addressToString(HRP, "P", addrBuf)

	if (p_addr == expected_paddr || expected_paddr == "") {
		console.log("Derivation path: " + path_prefix + index)
		console.log( "PrivateKey: " + private_key.toString('hex') )
		console.log( "PublicKey: " + public_key.toString('hex') )
		console.log( "P-Address: " + p_addr )
		console.log( "" )
		
		if (expected_paddr != "")
			process.exit(0)
	}
}

for (var i = 0; i < PROBE_NUM_DERIVATIONS; i++) {
	probeDerivation(hd_key, CAM_DERIVATION_PATH_PREFIX, i, EXPECTED_PADDR)
	probeDerivation(hd_key, AVAX_DERIVATION_PATH_PREFIX, i, EXPECTED_PADDR)
}
console.log("Failed to find private key for address: " + EXPECTED_PADDR)
process.exit(1)