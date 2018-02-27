import _ from 'underscore'
import React from 'react'
import { withSiteData } from 'react-static'
import { Card, Form, Row, Col, Input, Button } from 'antd'
import psl from 'psl'

const basePrice = 1;
const currency = '$';

function formatPrice(price) {
	return `${currency}${price}`;
}

const emptyDomain = { name: '', errorMessage: '' };

class Home extends React.Component {
	state = {
		domains: [{ ...emptyDomain }],
		email: '',
		loading: false,
		loadingMessage: '',
	}

	_onClickAddDomain = () => {
		const { domains } = this.state;
		domains.unshift({ ...emptyDomain });
		this.setState({ domains });
	}

	_onClickRemoveDomain = (i) => {
		const { domains } = this.state;
		domains.splice(i, 1);
		this.setState({ domains });
	}

	_onChangeDomainName = (i, name) => {
		const { domains } = this.state;
		domains[i].name = name.trim();
		this.setState({ domains });
	}

	_onChangeEmail = (email) => {
		this.setState({ email });
	}

	_onClickPay = async () => {
		if (!this.state.loading) {
			this.setState({ loading: true, loadingMessage: 'Validating the domain names...' });

			const names = _.chain(this.state.domains)
				.pluck('name')
				.filter(psl.isValid)
				.map(name => psl.parse(name).domain)
				.uniq()
				.value();

			const response = await fetch('/api/whois', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ names }),
			}).then(response => response.json());

			const validationMap = response.result || {}; // { [name: string]: boolean }

			const domains = _.chain(this.state.domains)
				.pluck('name')
				.filter(name => name.length > 0)
				.map(name => psl.isValid(name) ? psl.parse(name).domain : name)
				.uniq()
				.map(name => ({ name, errorMessage: validationMap[name] === true ? '' : 'Domain name not recognized' }))
				.value();

			if (domains.length === 0) {
				domains.push({ ...emptyDomain });
			}

			this.setState({ domains });
			this.setState({ loading: false });
		}
	}

	render() {
		const payButtonText = this.state.loading
			? this.state.loadingMessage
			: `Start monitoring for ${formatPrice(this.state.domains.length * basePrice)}`;

		return (
			<Card>
				<h1>Instant Domain Monitor</h1>
				<p>Start monitoring the expiration date of any domainName name, instantly.</p>

				<br />
				<h2>How it works</h2>
				<ol style={{ paddingLeft: 30, lineHeight: '1.8em' }}>
					<li>List the domainName names you want to monitor.</li>
					<li>Pay {formatPrice(basePrice)} for each domainName.</li>
					<li>Receive a weekly report by email (see an <a>example</a>), during 1 year, renewable.</li>
				</ol>

				<br />
				<h2>Domain names</h2>
				<p style={{ fontSize: '0.9em' }}>Don't worry about invalid domains, we will check the entire list before you pay.</p>
				<Form>
					{this.state.domains.map((domain, i) => (
						<Form.Item
							key={i}
							style={{ marginBottom: 1 }}
							validateStatus={domain.errorMessage == null || domain.errorMessage.length === 0 ? 'success' : 'error'}
							help={domain.errorMessage}
						>
							<Row>
								<Col span={22}>
									<Input
										placeholder="example.com"
										value={domain.name}
										onChange={evt => this._onChangeDomainName(i, evt.target.value)}
										disabled={this.state.loading}
									/>
								</Col>
								<Col span={2}>
									{i === 0
										? <Button
											style={{ marginLeft: 5 }}
											type="primary"
											size="small"
											shape="circle"
											icon="plus"
											onClick={this._onClickAddDomain}
											disabled={this.state.loading}
										/>
										: <Button
											style={{ marginLeft: 5 }}
											type="danger"
											size="small"
											shape="circle"
											icon="minus"
											onClick={() => this._onClickRemoveDomain(i)}
											disabled={this.state.loading}
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
							<Col span={22}>
								<Input
									placeholder="name@example.com"
									value={this.state.email}
									onChange={evt => this._onChangeEmail(evt.target.value)}
									disabled={this.state.loading}
								/>
							</Col>
							<Col span={2}>
							</Col>
						</Row>
					</Form.Item>
				</Form>

				<div>
					<Button
						type="primary"
						size="large"
						onClick={this._onClickPay}
						loading={this.state.loading}
					>
						{payButtonText}
					</Button>
				</div>

				<br />
				<br />
				<h2>FAQ</h2>
				<div>
					<br />
					<h3>Can I add more domains later?</h3>
					<p>Yes, you can simply create a new list using the same email address you already used. We will consolidate all your domainName names and deliver a single weekly report. (Please continue reading this FAQ in order to understand how you will be charged.)</p>

					<br />
					<h3>Can I remove domains from my report?</h3>
					<p>Only when the report is due to renew. Then, you will have the opportunity to review your domainName names  list.</p>

					<br />
					<h3>When do I have to renew the report?</h3>
					<p>You will be contacted to renew the report one year after its creation date and every year after that.</p>

					<br />
					<h3>How much will the renewal cost?</h3>
					<p>The cost will be {formatPrice(basePrice)} for each domainName name present in the report at the time of the renewal.</p>
					<p>For example, let's say your report was created in the 31st of January 2017 with 10 domainName names for {formatPrice(basePrice * 10)}, and in October 2017 you have added 2 more domains for {formatPrice(basePrice * 2)}. The renewal will cost {formatPrice(basePrice * 12)}, due in the 31st of January 2018.</p>

					<br />
					<h3>Can I change my email address?</h3>
					<p>You can contact <a>support</a> to do it for you.</p>

					<br />
					<h3>Which TLDs do you support?</h3>
					<p>Although we cannot guarantee we will support all TLDs in existence, our goal is to support as many as possible. We currently support more than 1000 TLDs, including the most popular gTLDs and ccTLDs. If you want to monitor a domainName name that isn't supported, please contact <a>support</a>.</p>
				</div>

				<br />
			</Card>
		);
	}
}

export default withSiteData(Home)
