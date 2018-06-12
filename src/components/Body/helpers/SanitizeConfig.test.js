import { iframeWhitelist } from './SanitizeConfig';

describe('testing iFrame regex', () => {
    // dtube test
    it('extract dtube iframe links out', () => {
        const dtubeIframeLnk = "https://emb.d.tube/#!/johnquake/lwltoj1t";
        const dtubeArrayLoc = 5;
        // test whether the regex can extract dtube link
        expect(iframeWhitelist[dtubeArrayLoc].re.test(dtubeIframeLnk)).toBe(true);
        // test the function able to return proper dtube link
        expect(iframeWhitelist[dtubeArrayLoc].fn(dtubeIframeLnk)).toBe(dtubeIframeLnk);
    })
})