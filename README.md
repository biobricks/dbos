# dbos

## Data Storage

The server reads and stores all information to disk, within the directory specified in the `DIRECTORY` environment variable.

- `${DIRECTORY}/keys` contains a JSON object with `secret` and `public` keys.  Their values are hex-encoded libsodium signature keys for signing publications.

- `${DIRECTORY}/accessions` is an append-only, line-delimited, plain-text file.  Each line contains an ISO8601 timestamp, followed by a comma, and then a hex-encoded SHA256 publication digest.  The line number is the accession number of the publication.  Each line is less than Linux' `PIPE_BUF`, affording atomicity.

- `${DIRECTORY}/peers` is an optional, line-delimited, comma-separate-values file.  Each line contains the URI and hex-encoded public key of another DBOS server, followed by the accession number of the latest publication republished by this DBOS server.  The server will periodically check these peer servers for new publications, validate them, and if it finds them valid, republish them, with both the peer's timestamp and a new timestamp.

- `${DIRECTORY}/publications/` contains:

  - `{digest}.json` files, deterministically-serialized JSON objects representing publications, with the addition of date stamps.

  - `{digest}.sig` files containing hex-encoded, detached libsodium signatures for the corresponding JSON files.

  - a `{digest}` directory per publication that contains:

    - `{public key}.json` files, deterministically-serialized JSON objects containing publication timestamps and cryptographic signatures

    - `{digest}` files, containing attachment data

    - `{digest}.type` files, containing MIME types for attachment data

## HTTP Data API

The server responds to requests to several endpoints.  The most important, for programs looking to access and consume data, are:

- `GET /accessions, Accept: text/csv` serves comma-separated tuples of ISO 8601 publication date-time and SHA-256 submission digest, in accession order, earliest first.  Clients can add a `?from=number` query parameter to limit to more recent accessions.

- `GET /publications/{digest}, Accept: application/json` serves JSON submission records.

- `GET /publications/{digest}/attachments/{digest}` serves submission attachments.

- `GET /publications/{digest}/timestamps` serves newline-delimited list of public keys for which the server has signed timestamps for the publication.

- `GET /publications/{digest}/timestamps/{public key}` serves JSON signed-timestamp records.

- `GET /key` serves the server's hex-encoded, Ed25519 public signing key.
