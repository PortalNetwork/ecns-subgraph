import {
  ByteArray,
  crypto
} from '@graphprotocol/graph-ts'

import {
  createEventID, ROOT_NODE, EMPTY_ADDRESS,
  uint256ToByteArray, byteArrayFromHex, concat
} from './utils'

// Import event types from the registry contract ABI
import {
  NameMigrated as NameMigratedEvent,
  NameRegistered as NameRegisteredEvent,
  NameRenewed as NameRenewedEvent,
  Transfer as TransferEvent,
} from './types/BaseRegistrar/BaseRegistrar'

import {
  NameRegistered as ControllerNameRegisteredEvent
} from './types/EtcRegistrarController/EtcRegistrarController'

// Import entity types generated from the GraphQL schema
import { Account, AuctionedName, Domain, Registration } from './types/schema'

var rootNode:ByteArray = byteArrayFromHex("2f142013fcc88d47bffe42e5d883f6081cbaa75abaa20e7f34f3043bbc8162c9")

export function handleNameMigrated(event: NameMigratedEvent): void {
  let label = uint256ToByteArray(event.params.id)

  let auctionedName = AuctionedName.load(label.toHex())

  let registration = new Registration(label.toHex())
  registration.domain = crypto.keccak256(concat(rootNode, label)).toHex();
  registration.registrationDate = auctionedName.registrationDate
  registration.expiryDate = event.params.expires
  registration.registrant = event.params.owner.toHex()
  registration.save()
}

export function handleNameRegistered(event: NameRegisteredEvent): void {
  let account = new Account(event.params.owner.toHex())
  account.save()

  let label = uint256ToByteArray(event.params.id)
  let registration = new Registration(label.toHex())
  registration.domain = crypto.keccak256(concat(rootNode, label)).toHex()
  registration.registrationDate = event.block.timestamp
  registration.expiryDate = event.params.expires
  registration.registrant = account.id
  registration.save()
}

export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
  let domain = new Domain(crypto.keccak256(concat(rootNode, event.params.label)).toHex())
  if(domain.labelName !== event.params.name) {
    domain.labelName = event.params.name
    domain.name = event.params.name + '.etc'
    domain.save()
  }
}

export function handleNameRenewed(event: NameRenewedEvent): void {
  let label = uint256ToByteArray(event.params.id)
  let registration = new Registration(label.toHex())
  registration.expiryDate = event.params.expires
  registration.save()
}

export function handleNameTransferred(event: TransferEvent): void {
  let label = uint256ToByteArray(event.params.tokenId)
  let registrant = event.params.to.toHex()
  let registration = Registration.load(label.toHex())
  if(registration == null) return;

  registration.registrant = registrant
  registration.save()
}