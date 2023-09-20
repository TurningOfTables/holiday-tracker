import bcrypt from 'bcrypt'
const saltRounds = 10;
const myPlaintextPassword = 'sausages'
const someOtherPlaintextPassword = 'bacon'


async function createHash() {
    const hash = await bcrypt.hash(myPlaintextPassword, saltRounds)
    return hash
}

async function check(hash) {
    const res = await bcrypt.compare(someOtherPlaintextPassword, hash)
    return res
}

const hash = await createHash()
const res = await check(hash)
console.log(res)