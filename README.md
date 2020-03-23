# ECNS Subgraph

This Subgraph sources events from the ECNS contracts, which inspire and fork from [ens](https://github.com/ensdomains/ens), [ethregistrar](https://github.com/ensdomains/ethregistrar) and [resolvers](https://github.com/ensdomains/resolvers). This includes the ECNS registry, therRegistrar, and resolvers that are created and linked to domains. The resolvers are added through dynamic data sources. More information on all of this can be found at [The Graph Documentation](https://thegraph.com/docs/).

## Contracts

### BaseRegistrar
BaseRegistrar is the contract that owns the TLD in the ECNS registry. This contract implements a minimal set of functionality:

- The owner of the registrar may add and remove controllers.
- Controllers may register new domains and extend the expiry of (renew) existing domains. They can not change the ownership or reduce the expiration time of existing domains.
- Name owners may transfer ownership to another address.
- Name owners may reclaim ownership in the ENS registry if they have lost it.
- Owners of names in the interim registrar may transfer them to the new registrar, during the 1 year transition period. When they do so, their deposit is returned to them in its entirety.
- This separation of concerns provides name owners strong guarantees over continued ownership of their existing names, while still permitting innovation and change in the way names are registered and renewed via the controller mechanism.

### ETCRegistrarController
ETCRegistrarController is the first implementation of a registration controller for the new registrar. This contract implements the following functionality:

- The owner of the registrar may set a price oracle contract, which determines the cost of registrations and renewals based on the name and the desired registration or renewal duration.
- The owner of the registrar may withdraw any collected funds to their account.
- Users can register new names using a commit/reveal process and by paying the appropriate registration fee.
- Users can renew a name by paying the appropriate fee. Any user may renew a domain, not just the name's owner.
- The commit/reveal process is used to avoid frontrunning, and operates as follows:

A user commits to a hash, the preimage of which contains the name to be registered and a secret value.
- After a minimum delay period and before the commitment expires, the user calls the register function with the name to register and the secret value from the commitment. If a valid commitment is found and the other preconditions are met, the name is registered.
- The minimum delay and expiry for commitments exist to prevent miners or other users from effectively frontrunnig registrations.

### SimplePriceOracle
SimplePriceOracle is a trivial implementation of the pricing oracle for the EthRegistrarController that always returns a fixed price per domain per year, determined by the contract owner.