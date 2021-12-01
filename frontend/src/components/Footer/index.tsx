import { Box, Link } from '@chakra-ui/layout';
import React from 'react';
import githubLogo from '../../images/Github/GitHub-Mark-64px.png';
import twitterLogo from '../../images/Twitter/Twitter logo/SVG/Logo black.svg';
import mediumLogo from '../../images/Medium/03_Symbol/01_Black/SVG/Medium_Symbol_NoPadding.svg';

const GITHUB_REPO = "https://github.com/Component-fi/YieldTokenCompounding";
const MEDIUM = "https://medium.com/@component_general";
const TWITTER = "https://twitter.com/componentfi";

export const Footer: React.FC<{}> = () => {
    return (
        <Box id="footer" textColor="text.primary">
            <div className="h-20 flex flex-row items-center justify-around sm:justify-end p-5 ">
                <div id="social-icons" className="flex flex-row gap-7">
                    <Link href={GITHUB_REPO} target="_blank">
                        <div id="proxy-github" className="h-8 w-8">
                            <img src={githubLogo} alt={"Github Logo"}/>
                        </div>
                    </Link>
                    <Link href={MEDIUM} target="_blank">
                        <div id="proxy-medium" className="h-8 w-8 flex flex-col justify-center">
                            <img src={mediumLogo} alt={"Medium Logo"}/>
                        </div>
                    </Link>
                    <Link href={TWITTER} target="_blank">
                        <div id="proxy-medium" className="h-8 w-8">
                            <img src={twitterLogo} alt={"Twitter Logo"}/>
                        </div>
                    </Link>
                </div>
            </div>
        </Box>
    )
}

export default Footer;