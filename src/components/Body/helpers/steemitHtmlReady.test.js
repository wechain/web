import HtmlReady from './steemitHtmlReady';

describe('make markdown html ready', () => {
    it('should link usernames', () => {
        const textwithmentions =
            '<xml xmlns="http://www.w3.org/1999/xhtml">@username (@a1b2, whatever</xml>';
        const htmlified =
            '<xml xmlns="http://www.w3.org/1999/xhtml"><span><a href="/author/@username">@username</a> (<a href="/author/@a1b2">@a1b2</a>, whatever</span></xml>';
        const res = HtmlReady(textwithmentions).html;
        console.log(res)
        expect(res).toEqual(htmlified);
    });

    it('should make @name into a tag @name', () => {
        // Refer to issue https://github.com/Steemhunt/web/issues/220
        const base = data => `<xml xmlns="http://www.w3.org/1999/xhtml">${data}</xml>`;
        const aTag = '<a href="/author/@superoo7">@superoo7</a>'
        const test1 = {
            test: base('something @superoo7 something'),
            expect: base(`<span>something ${aTag} something</span>`),
        }
        const test2 = {
            test: base('something [@superoo7 something'),
            expect: base(`<span>something [${aTag} something</span>`),
        }
        const test3 = {
            test: base('something -@superoo7 something'),
            expect: base(`<span>something -${aTag} something</span>`),
        }
        const test4 = {
            test: base('something +@superoo7 something'),
            expect: base(`<span>something +${aTag} something</span>`),
        }
        const test5 = {
            test: base('something ;@superoo7 something'),
            expect: base(`<span>something ;${aTag} something</span>`),
        }

        expect(HtmlReady(test1.test).html).toEqual(test1.expect)
        expect(HtmlReady(test2.test).html).toEqual(test2.expect)
        expect(HtmlReady(test3.test).html).toEqual(test3.expect)
        expect(HtmlReady(test4.test).html).toEqual(test4.expect)
        expect(HtmlReady(test5.test).html).toEqual(test5.expect)

    })
})