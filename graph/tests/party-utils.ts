import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { OwnershipTransferred, Purchase } from "../generated/Party/Party"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPurchaseEvent(
  from: Address,
  blockNumber: BigInt,
  price: BigInt
): Purchase {
  let purchaseEvent = changetype<Purchase>(newMockEvent())

  purchaseEvent.parameters = new Array()

  purchaseEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  purchaseEvent.parameters.push(
    new ethereum.EventParam(
      "blockNumber",
      ethereum.Value.fromUnsignedBigInt(blockNumber)
    )
  )
  purchaseEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return purchaseEvent
}
