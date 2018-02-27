import React from 'react'
import { withSiteData } from 'react-static'
import { Card, Form, Row, Col, Input, Button } from 'antd'

const basePrice = 1;
const currency = '$';

function formatPrice(price) {
	return `${currency}${price}`;
}

class Home extends React.Component {
	state = {
		domains: [''],
		email: '',
	}

	_onClickAddDomain = () => {
		const { domains } = this.state;
		domains.unshift('');
		this.setState({ domains });
	}

	_onClickRemoveDomain = (i) => {
		const { domains } = this.state;
		domains.splice(i, 1);
		this.setState({ domains });
	}

	_onChangeDomainName = (i, domain) => {
		const { domains } = this.state;
		domains[i] = domain;
		this.setState({ domains });
	}

	_onChangeEmail = (email) => {
		this.setState({ email });
	}

	render() {
		return (
			<Card>
				<h1>Instant Domain Monitor</h1>
				<p>Start monitoring the expiration date of any domain name, instantly.</p>

				<br />
				<h2>How it works</h2>
				<ol style={{ paddingLeft: 30, lineHeight: '1.8em' }}>
					<li>List the domain names you want to monitor.</li>
					<li>Pay {formatPrice(basePrice)} for each domain.</li>
					<li>Receive a weekly report by email (see an <a>example</a>), during 1 year, renewable.</li>
				</ol>

				<br />
				<h2>Domain names</h2>
				<Form>
					{this.state.domains.map((domain, i) => (
						<Form.Item key={i} style={{ marginBottom: 1 }}>
							<Row>
								<Col span={23}>
									<Input
										placeholder="www.example.com"
										value={domain}
										onChange={evt => this._onChangeDomainName(i, evt.target.value)}
									/>
								</Col>
								<Col span={1}>
									{i === 0
										? <Button
											style={{ marginLeft: 5 }}
											type="primary"
											size="small"
											shape="circle"
											icon="plus"
											onClick={this._onClickAddDomain}
										/>
										: <Button
											style={{ marginLeft: 5 }}
											type="danger"
											size="small"
											shape="circle"
											icon="minus"
											onClick={() => this._onClickRemoveDomain(i)}
										/>
									}
								</Col>
							</Row>
						</Form.Item>
					))}
				</Form>

				<br />
				<h2>Your Email</h2>
				<Form>
					<Form.Item>
						<Row>
							<Col span={23}>
								<Input
									placeholder="name@example.com"
									value={this.state.email}
									onChange={evt => this._onChangeEmail(evt.target.value)}
								/>
							</Col>
							<Col span={1}>
							</Col>
						</Row>
					</Form.Item>
				</Form>

				<div>
					<Button type="primary" size="large">Start monitoring for {formatPrice(this.state.domains.length * basePrice)}</Button>
				</div>

				<br />
				<br />
				<h2>FAQ</h2>
				<div>
				<br />
					<h3>Which TLDs do you support?</h3>
					<p>Although we cannot guarantee we will support all TLDs in existence, our goal is to support as many TLDs as possible. We currently support more than 1000 TLDs including .com, .org, .net, country codes, and several of the most popular generic ones. If you want to monitor a domain name with a TLD that is not working, please contact our <a>support</a>.</p>
					
					<br />
					<h3>Can I add more domains later?</h3>
					<p>Yes, you can simply create a new list using the same email address you already used. We will consolidate all your domain names and deliver a single weekly report. (Please continue reading this FAQ in order to understand how you will be charged.)</p>

					<br />
					<h3>Can I remove domains from my report?</h3>
					<p>Only when the report is due to renew. Then, you will have the opportunity to review your domain names  list.</p>

					<br />
					<h3>When do I have to renew the report?</h3>
					<p>You will be contacted to renew the report one year after its creation date and every year after that.</p>

					<br />
					<h3>How much will the renewal cost?</h3>
					<p>The cost will be {formatPrice(basePrice)} for each domain name present in the report at the time of the renewal.</p>
					<p>For example, let's say your report was created in the 31st of January 2017 with 10 domain names for {formatPrice(basePrice * 10)}, and in October 2017 you have added 2 more domains for {formatPrice(basePrice * 2)}. The renewal will cost {formatPrice(basePrice * 12)}, due in the 31st of January 2018.</p>

					<br />
					<h3>Can I change my email address?</h3>
					<p>You can contact our <a>support</a> to do it for you.</p>
				</div>

				<br />
			</Card>
		);
	}
}

export default withSiteData(Home)
