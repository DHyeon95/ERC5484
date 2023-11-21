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
   it('mint from owner', async function () {
      await expect(testContract.testMint(testUser.address, 1)).to.emit(testContract, 'Issued').withArgs(owner.address, testUser.address, 1, 1)
      .to.emit(testContract, 'Transfer').withArgs(constants.ZERO_ADDRESS, testUser.address, 1)
      expect(await testContract.balanceOf(testUser.address)).to.equal(1)
      expect(await testContract.ownerOf(1)).to.equal(testUser.address)
    })
    it('disallow mint from others', async function () {
      await expect(testContract.connect(testUser).testMint(owner.address, 1)).to.be.reverted
    })
  })

  describe('Transfer', function () {
    it('disallow transfers' , async function () {
      await expect(testContract.transferFrom(owner.address, testUser.address, 1)).to.be.reverted
    })
  })

  describe('Burn', function () {
    beforeEach( async function () {
      await testContract.testMint(owner.address, 2)
      await testContract.testMint(testUser.address, 1)
    })

    it('disallow burn from others', async function () {
      await expect(testContract.testBurn(1)).to.be.reverted
      expect(await testContract.ownerOf(1)).to.equal(testUser.address)
      expect(await testContract.balanceOf(testUser.address)).to.equal(1)

      await expect(testContract.connect(testUser).testBurn(2)).to.be.reverted
      expect(await testContract.ownerOf(2)).to.equal(owner.address)
      expect(await testContract.balanceOf(owner.address)).to.equal(1)
    })

    it('burn from tokenowner', async function () {
      await testContract.connect(testUser).testBurn(1)
      await expect(testContract.ownerOf(1)).to.be.reverted
      expect(await testContract.balanceOf(testUser.address)).to.equal(0)

      await testContract.testBurn(2)
      await expect(testContract.ownerOf(2)).to.be.reverted
      expect(await testContract.balanceOf(owner.address)).to.equal(0)
    })
  })  

  describe('BurnAuth', function ()  {
    beforeEach(async function () {
      await testContract.testMint(owner.address, 1)
    })

    it('check BurnAuth OwnerOnly', async function () {
      expect(await testContract.burnAuth(1)).to.equal(1)
    })
  })
})