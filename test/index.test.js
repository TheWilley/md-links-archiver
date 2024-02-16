const mla = require('../index')

test('should archive all formats', async () => {
    const archive = await mla(`[some url here](https://en.wikipedia.org/wiki/Example.com)`)
    expect(archive[0].html).toBeTruthy()
    expect(archive[0].pdf).toBeTruthy()
    expect(archive[0].png).toBeTruthy()
    expect(archive[0].txt).toBeTruthy()
})

test('should archive only html format', async () => {
    const archive = await mla('[some url here](https://en.wikipedia.org/wiki/Example.com)', ['html'])
    expect(archive[0].html).toBeTruthy()
    expect(archive[0].pdf).toBeFalsy()
    expect(archive[0].png).toBeFalsy()
    expect(archive[0].txt).toBeFalsy()
})

test('should archive only pdf format', async () => {
    const archive = await mla('[some url here](https://en.wikipedia.org/wiki/Example.com)', ['pdf'])
    expect(archive[0].html).toBeFalsy()
    expect(archive[0].pdf).toBeTruthy()
    expect(archive[0].png).toBeFalsy()
    expect(archive[0].txt).toBeFalsy()
})

test('should archive only png format', async () => {
    const archive = await mla('[some url here](https://en.wikipedia.org/wiki/Example.com)', ['png'])
    expect(archive[0].html).toBeFalsy()
    expect(archive[0].pdf).toBeFalsy()
    expect(archive[0].png).toBeTruthy()
    expect(archive[0].txt).toBeFalsy()
})

test('should archive only txt format', async () => {
    const archive = await mla('[some url here](https://en.wikipedia.org/wiki/Example.com)', ['txt'])
    expect(archive[0].html).toBeFalsy()
    expect(archive[0].pdf).toBeFalsy()
    expect(archive[0].png).toBeFalsy()
    expect(archive[0].txt).toBeTruthy()
})

test('archive should contain two items', async () => {
    const archive = await mla('[some url here](https://en.wikipedia.org/wiki/Example.com)[some other url here](https://en.wikipedia.org/wiki/EusLisp_Robot_Programming_Language)')
    expect(archive.length).toBe(2)
})