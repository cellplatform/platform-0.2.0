import { Controller } from './controller';
import { PeerEvents, GroupEvents } from '../logic.PeerNetwork.events';
import { GroupStrategy, PeerStrategy } from './strategy';
import { PeerNetbus as Netbus } from '../logic.PeerNetbus';
import { start } from './start';

export const PeerNetwork = {
  Controller,
  Netbus,

  GroupStrategy,
  PeerStrategy,

  PeerEvents,
  GroupEvents,

  start,
};
