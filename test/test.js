const { expect } = require('chai')
const { ethers } = require('hardhat')
const { constants } = require('@openzeppelin/test-helpers')

describe('test5484', function () {

  let testContract, owner
  beforeEach(async function() {
    [owner, testUser] = await ethers.getSigners()
    testContract = await ethers.deployContract('test5484', ['testsbt', 'tsbt'])
  })

  describe('Initialize', function () {
    it('should correct name', async function () {
      expect(await testContract.name()).to.equal('testsbt')
    })
    it('should correct symbol', async function () {
      expect(await testContract.symbol()).to.equal('tsbt')
    })
    it('should correct initialBalance', async function () {
      expect(await testContract.balanceOf(owner.address)).to.equal(0)
    })
    it('should correct contractOwner', async function () {
      expect(await testContract.owner()).to.equal(owner.address)
    })
  })

  describe('Mint', function () {
    // issued, transfer 이벤트 체크
   it('should mint from owner', async function () {
      await expect(testContract.testMint(testUser.address, 1)).to.emit(testContract, 'Issued').withArgs(owner.address, testUser.address, 1, 1)
      .to.emit(testContract, 'Transfer').withArgs(constants.ZERO_ADDRESS , testUser.address, 1)
      expect(await testContract.balanceOf(testUser.address)).to.equal(1)
      expect(await testContract.ownerOf(1)).to.equal(testUser.address)
    })
    it('should disallow mint from others', async function () {
      await expect(testContract.connect(testUser).testMint(owner.address, 1)).to.be.reverted
    })
  })

  describe('Transfer', function () {
    it('Should disallow transfers' , async function () {
      await expect(testContract.transferFrom(owner.address, testUser.address, 1)).to.be.reverted
    })
  })

  describe('Burn', function () {
    beforeEach( async function () {
      await testContract.testMint(testUser.address, 2)
    })

    it('should disallow transfers' , async function () {
      await expect(testContract.testBurn(1)).to.be.reverted
      console.log(await testContract.ownerOf(2))
      console.log(testUser.address)
      await testContract.connect(testUser).testBurn(2)
      // expect(await testContract.connect(testUser).testBurn(2))
      expect(await testContract.ownerOf(2)).to.equal(constants.ZERO_ADDRESS)
      expect(await testContract.balanceOf(testUser.address)).to.equal(0)
    })
  })

  describe('BurnAuth', function ()  {
    it('' , async function () {
      expect(await testContract.burnAuth(0)).to.equal(0)
    })
  })
})