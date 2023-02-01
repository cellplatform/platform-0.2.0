import { PeerNetbus as Netbus } from '../web.PeerNetbus';
import { GroupEvents, PeerEvents } from '../web.PeerNetwork.events';
import { Controller } from './controller';
import { start } from './start.mjs';
import { GroupStrategy, PeerStrategy } from './strategy';

export const PeerNetwork = {
  Controller,
  Netbus,

  GroupStrategy,
  PeerStrategy,

  PeerEvents,
  GroupEvents,

  start,
};
