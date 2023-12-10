import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import { yamux } from '@chainsafe/libp2p-yamux';

// import { createLibp2p } from 'libp2p'
// import { noise } from '@chainsafe/libp2p-noise'
import { multiaddr } from '@multiformats/multiaddr';
import first from 'it-first';
import { pipe } from 'it-pipe';
import { fromString, toString } from 'uint8arrays';
import { webRTC } from '@libp2p/webrtc';

import { bootstrap } from '@libp2p/bootstrap';

// Known peers addresses
// const bootstrapMultiaddrs = [
//   '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
//   '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
// ];

/**
 * Start a P2P data connection
 *  https://github.com/libp2p/js-libp2p/blob/main/doc/GETTING_STARTED.md#getting-started
 *
 * WebRTC
 *  https://docs.libp2p.io/concepts/transports/webrtc/
 *  https://github.com/libp2p/js-libp2p/tree/main/packages/transport-webrtc#readme
 */

export async function startLibp2p() {
  const node = await createLibp2p({
    transports: [webRTC()],
    connectionEncryption: [noise()],
  });

  await node.start();

  console.log('node', node);

  const ma = multiaddr(
    '/ip4/0.0.0.0/udp/56093/webrtc/certhash/uEiByaEfNSLBexWBNFZy_QB1vAKEj7JAXDizRs4_SnTflsQ',
  );
  const stream = await node.dialProtocol(ma, ['/my-protocol/1.0.0']);
  const message = `Hello js-libp2p-webrtc\n`;
  const response = await pipe([fromString(message)], stream, async (source) => await first(source));
  if (response) {
    const responseDecoded = toString(response.slice(0, response.length));
    console.log('responseDecoded', responseDecoded);
  }
}

// export async function startLibp2p() {
//   const node = await createLibp2p({
//     start: false,
//     addresses: {
//       listen: ['/ip4/127.0.0.1/tcp/8000/ws'],
//     },
//     transports: [webSockets()],
//     connectionEncryption: [noise()],
//     streamMuxers: [yamux(), mplex()],
//     peerDiscovery: [
//       bootstrap({
//         list: bootstrapMultiaddrs, // provide array of multiaddrs
//       }),
//     ],
//   });
//
//   node.addEventListener('peer:discovery', (evt) => {
//     console.log('Discovered %s', evt.detail.id.toString()); // Log discovered peer
//   });
//
//   node.addEventListener('peer:connect', (evt) => {
//     // console.log('Connected to %s', evt.detail.remotePeer.toString()); // Log connected peer
//     console.log('Connected to %s', evt.detail); // Log connected peer
//   });
//
//   // start libp2p
//   await node.start();
//   console.log('libp2p has started');
//
//   const listenAddrs = node.getMultiaddrs();
//   console.log('libp2p is listening on the following addresses: ', listenAddrs);
//
//   // stop libp2p
//   await node.stop();
//   console.log('libp2p has stopped');
// }
