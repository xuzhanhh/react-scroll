const cov = process.env.COVERAGE === 'true'

module.exports = {
    "snapshotSerializers": [
        "enzyme-to-json/serializer"
      ],
    "collectCoverage": cov
}