const Page = require('./helpers/page')
let page;

beforeEach(async ()=>{

    page = await Page.build();
    await page.goto('localhost:3000/');
})

afterEach(async ()=>{
    await page.close();
})


describe('When logged in', async()=>{
    beforeEach(async()=>{
        await page.login();
        await page.click('a[href="/blogs/new"]')
    })

    
    test('can see blog create form', async()=>{

        const titleLabel = await page.getContentsOf('.title label');
        const contentLabel = await page.getContentsOf('.content label');

        expect(titleLabel).toEqual('Blog Title')
        expect(contentLabel).toEqual('Content')

    })

    describe('And using valid inputs',async()=>{
        beforeEach(async()=>{
            await page.type('.title input','My Title')
            await page.type('.content input','My Content')
            await page.click('button[type="submit"]');

        })
        test('Submitting takes user to review screen', async()=>{
            const reviewText = await page.getContentsOf('form h5');
            expect(reviewText).toEqual('Please confirm your entries')

        })

        test('Submitting then saving adds blog to index page', async()=>{
            await page.click('button.green');
            await page.waitFor('.card')

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p')

            expect(title).toEqual('My Title')
            expect(content).toEqual('My Content')
        })
    })

    describe('And using invalid inputs', async()=>{
        beforeEach(async()=>{
            await page.click('button[type="submit"]');
        })
        test('the form shows an error message', async()=>{
            const titleError = await page.getContentsOf('.title .red-text');
            const ContentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value')
            expect(ContentError).toEqual('You must provide a value')

        })
    })


})


describe('User is not logged in', async()=>{

    const actions= [
        {
            method:'get',
            path:'/api/blogs',

        },
        {
            method:'post',
            path:'/api/blogs',
            data:{
                title:'T',
                content:'C'
            }
        }
    ]

    test.only('Blog related actions are prohibited', async()=>{
        const results = await page.execRequests(actions);

        for(let result of results){
            expect(result).toEqual({ error: 'You must log in!' })
        }
    })

})


