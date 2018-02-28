import _ from 'underscore'
import numeral from 'numeral';
import React from 'react'
import { withSiteData } from 'react-static'
import { Card, Form, Row, Col, Input, Button, Alert } from 'antd'
import psl from 'psl'

const basePrice = 1.50;
const currency = '$';
const priceFormatStr = `${currency}0.00`;

class Home extends React.Component {
	state = getInitialState();

	componentWillMount() {
		Paddle.Setup({ vendor: 21790 });
	}

	_onClickAddDomain = () => {
		const domains = [...this.state.domains];
		domains.unshift(getEmptyDomain());
		this.setState({ domains, domainsErrorMessage: '' });
		localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onClickRemoveDomain = (i) => {
		const domains = [...this.state.domains];
		domains.splice(i, 1);
		this.setState({ domains, domainsErrorMessage: '' });
		localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onChangeDomainName = (i, name) => {
		const valid = name.length === 0 || psl.isValid(name);
		const domains = [...this.state.domains];
		domains[i].name = name;
		domains[i].hasError = !valid;
		this.setState({ domains, domainsErrorMessage: '' });
		localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onChangeEmail = (email) => {
		this.setState({ email, emailErrorMessage: '' });
		localStorage.setItem('email', JSON.stringify(email));
	}

	_onClickPay = async () => {
		if (!this.state.loading) {
			this.setState({ loading: true, domainsErrorMessage: '', emailErrorMessage: '' });
			let continueToServer = true;

			// validate domains client-side
			const validNames = getUniqueValidNames(this.state.domains);

			let allValid1 = true;
			const domains1 = _.chain(this.state.domains)
				.map(domain => {
					const validName = psl.parse(domain.name).domain;
					const valid = domain.name.length === 0 || validNames.indexOf(validName) >= 0;
					allValid1 = allValid1 && valid;
					return { ...domain, hasError: !valid };
				})
				.value();

			if (validNames.length === 0) {
				this.setState({ loading: false, domains: domains1, domainsErrorMessage: 'There are no valid domains in the list' });
				continueToServer = false;
			}
			if (!allValid1) {
				this.setState({ loading: false, domains: domains1, domainsErrorMessage: 'There are invalid domains in the list' });
				continueToServer = false;
			}

			// validate email
			if (!validateEmail(this.state.email)) {
				this.setState({ loading: false, emailErrorMessage: 'Please provide a valid email address' });
				continueToServer = false;
			}

			if (!continueToServer) {
				return;
			}

			// validate domains server-side
			const response = await fetch('/api/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ names: validNames }),
			}).then(response => response.json());

			const validByName = response.result || {};

			let allValid2 = true;
			const domains2 = _.chain(this.state.domains)
				.map(domain => {
					const validName = psl.parse(domain.name).domain;
					const valid = domain.name.length === 0 || validByName[validName] === true;
					allValid2 = allValid2 && valid;
					return { ...domain, hasError: !valid };
				})
				.value();

			if (!allValid2) {
				this.setState({ loading: false, domains: domains2, domainsErrorMessage: 'There are invalid domains in the list' })
				return;
			}

			const email = this.state.email;
			const response2 = await fetch('/api/unmonitored', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ names: getUniqueValidNames(domains2), email }),
			}).then(response => response.json());
			console.log('response2', response2);
			const unmonitored = response2.unmonitored;

			if (unmonitored.length === 0) {
				this.setState({ loading: false, domains: domains2, emailErrorMessage: 'All the listed domains are already being monitored by this email' });
				return;
			}
			
			// proceed to payment
			const passthrough = uuidv4();
			// Paddle.Checkout.open({
				// 	product: 525713,
				// 	quantity: unmonitored.length,
				// 	email,
				// 	passthrough,
				// 	successCallback: (data) => {
					const response3 = await fetch('/api/checkout', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ names: unmonitored, email, checkout_id: passthrough, paddle_response: JSON.stringify({}) }),
					}).then(response => response.json());
					console.log('response3', response3);

					/*
					const data = window['paddle_data'];
					console.log('successCallback data', JSON.stringify(data));
					localStorage.clear();
					this.setState({ ...getInitialState(), showSuccessMessage: true, email });
					*/
			// 	},
			// 	closeCallback: () => {
			// 	},
			// });

			this.setState({ loading: false, domainsErrorMessage: '', emailErrorMessage: '' });
		}
	}

	render() {
		const validNamesLen = getUniqueValidNames(this.state.domains).length;

		return (
			<Card>
				<h1>Instant Domain Monitor</h1>
				<p>Start monitoring the expiration date of any domain name</p>

				<br />
				<h2>How it works</h2>
				<ol style={{ paddingLeft: 30, lineHeight: '1.8em' }}>
					<li>List the domain names you want to monitor</li>
					<li>Pay {formatPrice(basePrice)}/year for each monitored domain</li>
					<li>Receive a weekly report by email (see <a>example</a>)</li>
				</ol>

				<br />
				<h2>Domain names</h2>
				<p style={{ fontSize: '0.95em' }}>We will validate all the domains before you pay</p>
				<Form>
					{this.state.domains.map((domain, i) => (
						<Form.Item
							key={i}
							style={{ marginBottom: 1 }}
							validateStatus={domain.hasError ? 'error' : 'success'}
						>
							<Row>
								<Col span={22}>
									<Input
										placeholder="example.com"
										value={domain.name}
										onChange={evt => this._onChangeDomainName(i, evt.target.value.trim())}
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

				<p style={{ color: 'red', fontSize: '0.95em' }}>{this.state.domainsErrorMessage}</p>

				<br />
				<h2>Your Email</h2>
				<Form>
					<Form.Item style={{ marginBottom: 1 }}>
						<Row>
							<Col span={22}>
								<Input
									placeholder="name@example.com"
									value={this.state.email}
									onChange={evt => this._onChangeEmail(evt.target.value.trim())}
									disabled={this.state.loading}
								/>
							</Col>
							<Col span={2}>
							</Col>
						</Row>
					</Form.Item>
				</Form>

				<p style={{ color: 'red', fontSize: '0.95em' }}>{this.state.emailErrorMessage}</p>

				<br />
				<Row gutter={24}>
					<Col span={11}>
						<Button
							style={{ width: '100%' }}
							type="primary"
							size="large"
							onClick={this._onClickPay}
							loading={this.state.loading}
						>
							Start monitoring for {formatPrice(validNamesLen * basePrice)}
						</Button>
					</Col>
					<Col span={11}>
						<Button
							style={{ width: '100%', fontSize: '0.9em' }}
							type="dashed"
							size="large"
							disabled={this.state.loading}
						>
							Or give us your feedback
						</Button>
					</Col>
				</Row>

				{this.state.showSuccessMessage &&
					<Row gutter={24}>
						<Col span={22}>
							<br />
							<Alert
								type="success"
								message={
									<div>
										<h3>Thank you for using our service</h3>
										<p>We will start sending you weekly reports by mail</p>
									</div>
								}
								closable={true}
								onClose={() => this.setState({ showSuccessMessage: false })}
							/>
						</Col>
					</Row>
				}

				<br />
				<br />
				<h2>FAQ</h2>
				<div>
					<br />
					<h3>Can I add more domains later?</h3>
					<p>Yes, you can simply create a new list and use the same email address as before. We will consolidate all your domain names and deliver a single weekly report.</p>
					<p>If you happen to repeat a domain name you were already monitoring, don't worry, we automatically detect duplicates and not charge twice.</p>

					<br />
					<h3>Can I remove domains from my report?</h3>
					<p>You can contact <a>support</a> to do it for you.</p>

					<br />
					<h3>Can I change my email address?</h3>
					<p>You can contact <a>support</a> to do it for you.</p>

					<br />
					<h3>Which TLDs do you support?</h3>
					<p>Although we cannot guarantee we will support all TLDs in existence, our goal is to support as many as possible. We currently support more than 1000 TLDs, including the most popular gTLDs and ccTLDs.</p>
					<p>We also validate all the domain names in your list before you pay, so unsupported TLDs will not be included.</p>
				</div>

				<br />
			</Card>
		);
	}
}

function getInitialState() {
	const domains = JSON.parse(localStorage.getItem('domains')) || [getEmptyDomain()];
	const email = JSON.parse(localStorage.getItem('email')) || '';
	return {
		domains,
		email,
		loading: false,
		domainsErrorMessage: '',
		emailErrorMessage: '',
		showSuccessMessage: false,
	};
}

function getEmptyDomain() {
	return { name: '', hasError: false };
}

function getUniqueValidNames(domains) {
	return _.chain(domains)
		.pluck('name')
		.filter(name => psl.isValid(name))
		.map(name => psl.parse(name).domain)
		.uniq()
		.value();
}

function formatPrice(price) {
	const priceStr = numeral(price).format(priceFormatStr);
	const tokens = priceStr.split('.');
	return (
		<span>
			<span>{tokens[0]}</span>
			<span>.</span>
			<span style={{ fontSize: '0.9em' }}>{tokens[1]}</span>
		</span>
	);
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export default withSiteData(Home)
