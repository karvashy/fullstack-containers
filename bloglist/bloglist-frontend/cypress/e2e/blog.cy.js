describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', '/api/testing/reset')
        cy.visit('')
    })

    it('Login form is shown', function() {
        cy.visit('')
        cy.contains('log in to application')
        cy.contains('login')
    })

    describe('Login', function(){
        beforeEach(function(){
            const user = {
                'username':'test',
                'password':'test'
            }
            cy.request('POST','/api/users',user)
        })
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('test')
            cy.get('#password').type('test')
            cy.get('#login').click()

        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('test1')
            cy.get('#password').type('test2')
            cy.get('#login').click()
            cy.contains('wrong username or password')
            //TODO: fix this
            // cy.get('.error').should('have.css','color','rgb(255,0,0)')
        })
    })
    describe('When logged in', function() {
        beforeEach(function() {
            const user = {
                'username':'test',
                'password':'test'
            }
            cy.request('POST','/api/users',user)
            cy.visit('')
        })

        it('A blog can be created', function() {
            cy.get('#username').type('test')
            cy.get('#password').type('test')
            cy.get('#login').click()
            const blog = {
                title: 'testing title',
                author: 'testing author',
                url: 'testing url'
            }
            cy.createBlog(blog)
            cy.contains('testing title')
        })

        it('A blog can be liked', function() {
            cy.get('#username').type('test')
            cy.get('#password').type('test')
            cy.get('#login').click()
            const blog = {
                title: 'testing title',
                author: 'testing author',
                url: 'testing url'
            }
            cy.createBlog(blog)
            cy.wait(1000)
            cy.contains('testing title').parent().contains('view').click()
            cy.wait(1000)
            cy.contains('like').click()
            cy.contains('likes 1')
        })
        it('A blog created by a user can be deleted by the user',function() {
            cy.get('#username').type('test')
            cy.get('#password').type('test')
            cy.get('#login').click()
            const blog = {
                title: 'testing title',
                author: 'testing author',
                url: 'testing url'
            }
            cy.createBlog(blog)
            cy.wait(1000)
            cy.contains('view').click()
            cy.contains('remove').click()
        })
        it('A blog remove button can be seen only by the owner',function(){
            cy.login({ 'username':'test','password':'test' })
            const blog = {
                title: 'testing title',
                author: 'testing author',
                url: 'testing url'
            }
            cy.createBlog(blog)
            const user = {
                'username':'test1',
                'password':'test1'
            }
            cy.request('POST','/api/users',user)
            cy.contains('logout').click()
            cy.get('#username').type('test1')
            cy.get('#password').type('test1')
            cy.get('#login').click()
            cy.contains(blog.title).parent().contains('view').click()
            cy.should('not.contain','remove')
        })
        it('Blogs are arranged in descending order of likes', function(){
            cy.login({ 'username':'test','password':'test' })
            const blog = {
                title: 'testing title 1',
                author: 'testing author 1',
                url: 'testing url 1'
            }
            cy.createBlog(blog)
            const blog2 = {
                title: 'testing title 2',
                author: 'testing author 2',
                url: 'testing url 2'
            }
            const blog3 = {
                title: 'testing title 3',
                author: 'testing author 3',
                url: 'testing url 3'
            }
            cy.createBlog(blog3)
            cy.createBlog(blog2)
            cy.contains('testing title 1').contains('view').click()
            cy.contains('testing title 1').contains('like').click()
            cy.wait(500)
            cy.contains('testing title 1').contains('like').click()
            cy.wait(500)
            cy.contains('testing title 1').contains('like').click()
            cy.wait(500)
            // Two clicks on blog2
            cy.contains('testing title 2').contains('view').click()
            cy.contains('testing title 2').contains('like').click()
            cy.wait(500)
            cy.contains('testing title 2').contains('like').click()
            cy.contains('testing title 3').contains('view').click()
            // One click on blog3
            cy.contains('testing title 3').contains('like').click()
            cy.wait(500)
            cy.visit('')
            cy.contains('testing title 1').contains('view').click()
            cy.contains('testing title 2').contains('view').click()
            cy.contains('testing title 3').contains('view').click()
            cy.get('.blog').eq(0).should('contain', 'testing title 1')
            cy.get('.blog').eq(1).should('contain', 'testing title 2')
            cy.get('.blog').eq(2).should('contain', 'testing title 3')
        })

    })
    after(function() {
        cy.request('POST', '/api/testing/reset')
    })
})
