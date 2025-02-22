import React, { useState, useEffect } from 'react'

import styled from 'styled-components'

import gql from 'graphql-tag'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useQuery } from '@apollo/react-hooks'
import { client, blockClient } from '../apollo/client'

import { Link } from 'gatsby'

import Layout from '../layouts'
import SEO from '../components/seo'
import BG from '../components/bg'

const StyledAbout = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  justify-content: space-between;
  padding: 0 2rem;
  padding-bottom: 4rem;
  margin-bottom: 4rem;
  padding-top: 2rem;

  border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};

  @media (max-width: 960px) {
    flex-direction: column;
    grid-template-columns: 1fr;
    margin-top: 0rem;
    padding-top: 1rem;
  }
`

const StyledSectionFlex = styled.div`
  padding: 0 0 4rem 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  max-width: 960px;
  margin-left: 5rem;
  @media (max-width: 1024px) {
    padding: 1rem;
    margin-top: 0rem;
    flex-direction: ${({ wrapSmall }) => (!wrapSmall ? 'row' : 'column')};
  }
  @media (max-width: 960px) {
    padding: 1rem;
    margin-left: 0;
    margin-top: 0rem;
    width: 100%;
    flex-direction: column;
  }
  h1,
  h2 {
    max-width: 650px;
  }
  p {
    /* margin-bottom: 0.5rem; */
    max-width: 650px;
  }
`

const Numbers = styled(StyledSectionFlex)`
  @media (max-width: 960px) {
    display: none;
  }
`

const Title = styled.h1`
  /* font-size: 3rem; */
  margin-bottom: 4rem;
  font-size: 72px;

  pointer-events: none;
  white-space: wrap;
  overflow-wrap: normal;
  max-width: 1200px;
  /* text-align: center; */
  @media (max-width: 960px) {
    font-size: 2rem;
  }
`

const InternalLink = styled(Link)`
  border-radius: 8px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  h2 {
    margin: 0;
  }

  transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    transform: translate3d(2px, 2px, 10px);
  }
`

const ExternalLink = styled.a`
  border-radius: 8px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  h2 {
    margin: 0;
  }

  transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    transform: translate3d(2px, 2px, 10px);
  }
`

export const GET_BLOCK = gql`
  query blocks($timestamp: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $timestamp }) {
      id
      number
      timestamp
    }
  }
`

export const ETH_PRICE = block => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${1} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${1} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

const APOLLO_QUERY = gql`
  {
    uniswapFactory(id: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f") {
      totalVolumeUSD
      totalLiquidityUSD
      pairCount
      txCount
    }
    bundle(id: 1) {
      ethPrice
    }
  }
`

export const UNISWAP_GLOBALS_24HOURS_AGO_QUERY = block => {
  let queryString = `
  query uniswapFactory {
    uniswapFactory(id: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", block: { number: ${block} }) {
      totalVolumeUSD
      totalLiquidityUSD
      pairCount
    
    }
  }
  `
  return gql(queryString)
}

const About = props => {
  dayjs.extend(utc)
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()

  const { data: blockData } = useQuery(GET_BLOCK, {
    client: blockClient,
    variables: {
      timestamp: utcOneDayBack
    }
  })
  const oneDayBackBlock = blockData?.blocks?.[0]?.number
  const { data } = useQuery(APOLLO_QUERY, { pollInterval: 10000, client: client })

  const [oneDayResult, setOnedayResult] = useState()

  useEffect(() => {
    async function getData() {
      let result = await client.query({
        query: UNISWAP_GLOBALS_24HOURS_AGO_QUERY(oneDayBackBlock),

        fetchPolicy: 'cache-first'
      })
      if (result) {
        setOnedayResult(result?.data?.uniswapFactory)
      }
    }
    if (oneDayBackBlock) {
      getData()
    }
  }, [oneDayBackBlock])

  let UniStats = {
    key: function(n) {
      return this[Object.keys(this)[n]]
    }
  }

  if (data && oneDayResult) {
    const volume24Hour = parseFloat(data?.uniswapFactory?.totalVolumeUSD) - parseFloat(oneDayResult?.totalVolumeUSD)

    UniStats.volume = [
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
      }).format(volume24Hour)
    ]
    UniStats.liquidity = [
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short'
        // maximumSignificantDigits: 5
      }).format(data.uniswapFactory.totalLiquidityUSD)
    ]
    UniStats.exchanges = [Number.parseFloat(data?.uniswapFactory?.pairCount)]

    UniStats.ETHprice = [
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short',
        maximumSignificantDigits: 5
      }).format(parseFloat(data?.bundle?.ethPrice)),
      '<small> Uni ETH Price </small>'
    ]
  }

  return (
    <Layout path={props.location.pathname}>
      <BG />

      <SEO title="About" path={props.location.pathname} />
      <StyledAbout>
        <span style={{ marginTop: '5rem' }}>
          <Title style={{ paddingBottom: '4rem' }}>
          What is StartCy?
          </Title>

          <Numbers id="about" style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', margin: 0 }}>
              <h2 style={{ fontSize: '32px' }}>
                {UniStats.exchanges}
                <p style={{ fontSize: '14px' }}>Token Pairs </p>
              </h2>
              <h2 style={{ fontSize: '32px' }}>
                {UniStats.volume}
                <p style={{ fontSize: '14px' }}>24H Volume</p>
              </h2>
              <h2 style={{ fontSize: '32px' }}>
                {UniStats.liquidity}
                <p style={{ fontSize: '14px' }}>Total Liquidity</p>
              </h2>
              <h2 style={{ fontSize: '32px' }}>
                {'> 200'}
                <p style={{ fontSize: '14px' }}>DeFi Integrations</p>
              </h2>
            </div>
          </Numbers>
          <StyledSectionFlex id="about" style={{ flexDirection: 'column' }}>
            <p>
            We are the first decentralized startup community in Cyprus governed by our own DAO. We are a win-win culture system that brings together ideas, skills and capital. 
Don’t get us wrong, we do like food and leisure, that’s why we usually host meetups, parties and other social events. All these events bring us together with other like-minded folks and give us the opportunity to talk about our passions and exchange our ideas in a face-to-face context.
Just like described in the book “The Rainforest”, a tree in Amazon Forest will grow 10x times bigger than it will grow in the Sahara Desert, because the rainforest provides all the vital ingredients to that tree. StartCy community aims to make Cyprus a “rainforest for startups” and provide all the vital “ingredients” (i.e., skills, ideas, networking and capital) for these “startup trees” to grow!

            </p>
            <p>We are committed to open source software and building on the decentralized web.</p>

            <div style={{ display: 'flex', width: '100%', margin: 0 }}>
              <InternalLink to="/blog/uni">UNI token</InternalLink>
              <InternalLink to="/whitepaper.pdf">
                V2 Whitepaper <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
              <InternalLink to="/whitepaper-v3.pdf">
                V3 Whitepaper <span style={{ fontSize: '11px' }}>↗</span>
              </InternalLink>
              <InternalLink to="/faq">FAQ</InternalLink>
            </div>
          </StyledSectionFlex>

          <StyledSectionFlex id="jobs" style={{ flexDirection: 'column' }}>
            <h2 style={{ width: '100%' }}>Jobs</h2>
            <p>We are looking for talented people to join our team!</p>

          </StyledSectionFlex>

          <StyledSectionFlex id="contact" style={{ flexDirection: 'column' }}>
            <h2 style={{ width: '100%' }}>Contact</h2>
            <p>
              To get in touch, please email <a href="mailto:contact@startcy.io">contact@startcy.io</a>
            </p>

         

            <div style={{ display: 'flex', width: '100%', margin: 0 }}>
              <ExternalLink href={'https://discord.gg/PAJKJcrD'}>
                Discord <span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
              <ExternalLink href={'https://twitter.com/startcydao?s=11&t=SdrUlxvj9HtebuHtIT935Q'}>
                Twitter <span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
              <ExternalLink href={'https://t.me/StartCy'}>
                Telegram <span style={{ fontSize: '11px' }}>↗</span>
              </ExternalLink>
            </div>
          </StyledSectionFlex>

          <StyledSectionFlex id="brand" style={{ flexDirection: 'column' }}>
            <h2 style={{ width: '100%' }}>Brand Assets</h2>
          
          </StyledSectionFlex>
        </span>
      </StyledAbout>
    </Layout>
  )
}

export default About
