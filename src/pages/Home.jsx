import _ from 'underscore'
import numeral from 'numeral';
import React from 'react'
import { withSiteData } from 'react-static'
import { Card, Form, Row, Col, Input, Button, Modal, notification, message } from 'antd'
import psl from 'psl'

const VERSION = 1;
const inBrowser = typeof document !== 'undefined';

const serviceName = 'Instant Domain Monitor';
const currency = '$';
const basePrice = 10;
const baseQty = 10;
// const priceFormat = `${currency}0.00`;
const priceFormat = `${currency}0`;


class Home extends React.Component {
	state = createInitialState();

	componentWillMount() {
		if (inBrowser) {
			Paddle.Setup({ vendor: 21790 });

			const version = JSON.parse(localStorage.getItem('version')) || 0;
			if (version === VERSION) {
				const domains = JSON.parse(localStorage.getItem('domains')) || [createEmptyDomain()];
				const email = JSON.parse(localStorage.getItem('email')) || '';
				this.setState({ ...createInitialState(), domains, email });
			} else {
				localStorage.clear();
				localStorage.setItem('version', JSON.stringify(VERSION));
			}
		}
	}

	render() {
		return (
			<Card>
				{this._renderHeader()}
				{this._renderHowItWorks()}
				{this._renderDomainList()}
				{this._renderEmail()}
				{this._renderSubmitButtons()}
				{this._renderFAQ()}
				{this._renderBulkModal()}
			</Card>
		);
	}

	_renderHeader() {
		return (
			<div>
				<h1>{serviceName}</h1>
				<p>Start monitoring the domain names you care about</p>
			</div>
		);
	}

	_renderHowItWorks() {
		return (
			<div>
				<br />
				<h2>How does it work?</h2>
				<ol style={{ paddingLeft: 15, lineHeight: '1.8em' }}>
					<li>Write down the domain names you want to monitor</li>
					<li>Pay the yearly subscription</li>
					<li>Receive a monthly report by email (see <a>example</a>)</li>
				</ol>

				<br />
				<h2>How much does it cost?</h2>
				<p> {formatPrice(basePrice)}/year for up to {baseQty} domain names, {formatPrice(basePrice * 2)}/year for up to {baseQty * 2} domain names, etc.</p>

			</div>
		);
	}

	_renderDomainList() {
		return !this.state.bulkModalVisible && (
			<div>
				<br />
				<Row type="flex" align="bottom">
					<Col span={12}>
						<h2>Your domain names list</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right', paddingRight: 14, marginBottom: 3 }}>
						<Button
							style={{ margin: 3 }}
							type="default"
							size="small"
							shape="circle"
							icon="form"
							onClick={() => this.setState({
								bulkModalVisible: true,
								bulkModalLines: this._getValidNames().sort((a, b) => a.localeCompare(b)).join('\n'),
							})}
							disabled={this.state.loading}
						/>
						<Button
							style={{ margin: 3 }}
							type="primary"
							size="small"
							shape="circle"
							icon="plus"
							onClick={this._onClickAddDomain}
							disabled={this.state.loading}
						/>
					</Col>
				</Row>
				<Form>
					{this.state.domains.map((domain, i) => {
						let helpText, validateStatus = '';
						switch (domain.status) {
							case STATUS.VALID:
								helpText = domain.name !== domain.validName ? `Same as ${domain.validName}` : undefined;
								break;
							case STATUS.INVALID:
								validateStatus = 'error';
								break;
							case STATUS.MONITORED:
								helpText = domain.monitoredByEmail === this.state.email ? `This domain is already being monitored by ${this.state.email}` : undefined;
								validateStatus = domain.monitoredByEmail === this.state.email ? 'error' : '';
								break;
						}

						return (
							<Row key={i}>
								<Col span={22}>
									<Form.Item
										style={{ marginBottom: 1 }}
										validateStatus={validateStatus}
										help={helpText != null &&
											<p style={{ marginLeft: 12, marginTop: 2, marginBottom: 5, fontSize: '0.9em' }}>
												{helpText}
											</p>
										}
									>
										<Input
											placeholder="example.com"
											value={domain.name}
											onChange={evt => this._onChangeDomainName(i, evt.target.value.trim())}
											disabled={this.state.loading}
										/>
									</Form.Item>
								</Col>
								<Col span={2} style={{ marginTop: 8 }}>
									<Button
										style={{ marginLeft: 5 }}
										type="danger"
										size="small"
										shape="circle"
										icon="minus"
										onClick={() => this._onClickRemoveDomain(i)}
										disabled={this.state.domains.length === 1 || this.state.loading}
									/>
								</Col>
							</Row>
						);
					})}
				</Form>
			</div>
		);
	}

	_renderEmail() {
		return (
			<div>
				<br />
				<h2>Your Email</h2>
				<Form>
					<Form.Item
						style={{ marginBottom: 1 }}
						validateStatus={this.state.emailHasError ? 'error' : 'success'}
						help={this.state.emailHasError &&
							<p style={{ marginLeft: 12, marginTop: 2, marginBottom: 0, fontSize: '0.9em' }}>
								{this.state.emailHasError}
							</p>
						}
					>
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
			</div>
		)
	}

	_renderSubmitButtons() {
		return (
			<div>
				<br />
				<Row gutter={24}>
					<Col span={11}>
						{this._renderPayButton()}
					</Col>
					<Col span={11}>
						{this._renderFeedbackButton()}
					</Col>
				</Row>
			</div>
		);
	}

	_renderPayButton() {
		return (
			<Button
				style={{ width: '100%' }}
				type="primary"
				size="large"
				onClick={this._onClickPay}
				loading={this.state.loading}
			>
				Start monitoring for {formatPrice(this._getPrice())}
			</Button>
		);
	}

	_renderFeedbackButton() {
		return (
			<Button
				style={{ width: '100%', fontSize: '0.9em' }}
				type="dashed"
				size="large"
				disabled={this.state.loading}
			>
				Or send us your feedback
			</Button>
		);
	}

	_renderFAQ() {
		return (
			<div>
				<br />
				<br />
				<h2>FAQ</h2>
				<div>
					<br />
					<h3>Can I add more domains later?</h3>
					<p>Yes, and you don't have to worry if you repeat a domain name you were already monitoring, we automatically detect duplicates and do not charge twice.</p>

					<br />
					<h3>Can I remove or replace domains from my report?</h3>
					<p>Yes, but you need to contact our <a>support</a> to do it for you. We need to make sure there isn't anyone trying to abuse our service.</p>

					<br />
					<h3>Can I change my email address?</h3>
					<p>Yes, you can contact <a>support</a> to do it for you.</p>

					<br />
					<h3>Which domain name extensions (TLDs) do you support?</h3>
					<p>We support thousands of domain name extensions. This is actually what sets us apart from the competition.</p>
					<p>We also validate the domain names in your list before you pay, so it will be clear to you which ones are unsupported or invalid.</p>

					<br />
					<h3>Why should I use this?</h3>
					<p>Consider this experience, from the creator of {serviceName}:</p>
					<div style={{ paddingLeft: 14, paddingRight: 14 }}>
						<p><em>“I got burned by a domain name registrar.
						Last year, after renewing my domains, I checked the new expiration date in the registrar's admin panel and everything seemed ok.
						Several weeks later, I happened to check the whois of one of the domains, just by accident. Imagine my surprise when I saw the domain name was about to expire! I then checked all the other domain names and none was renewed, although their admin panel said otherwise!
						Since then, I decided to never blindly trust a registrar again.”</em> ~ Dário Freire</p>
					</div>
					<p>So, maybe you also had bad experiences with your registrar and decided to use an <b>independent domain monitoring service</b>.</p>
					<p>Or you simply want to check the details of <b>all the domain names you own in a single report</b>, instead of having to visit the different admin panels of the registrars you use.</p>
					<p>Or, you have been using alternative services and you've just found out <b>they don't support all the domain extensions you need</b>.</p>
					<p>This service was born from scratching our own itch and has grown to accommodate more and more people's feedback. If you have similar needs, <a>please tell us</a>.</p>

					<br />
					<br />
				</div>
			</div>
		)
	}

	_renderBulkModal() {
		return (
			<Modal
				title="Edit the domain names here"
				visible={this.state.bulkModalVisible}
				maskClosable={false}
				onCancel={() => this.setState({ bulkModalVisible: false, bulkModalLines: '' })}
				onOk={() => {
					const domains = this.state.bulkModalLines.split('\n')
						.map(name => name.trim())
						.filter(name => name.length > 0)
						.sort((a, b) => a.localeCompare(b))
						.map(name => createDomain(name));

					if (domains.length === 0) {
						domains.push(createEmptyDomain());
					}

					this.setState({ domains, bulkModalVisible: false, bulkModalLines: '' });
					inBrowser && localStorage.setItem('domains', JSON.stringify(domains));
				}}
			>
				<p>Write each domain name in a separate line:</p>
				<Input.TextArea
					autosize={{ minRows: 5, maxRows: 17 }}
					value={this.state.bulkModalLines}
					onChange={(evt) => this.setState({ bulkModalLines: evt.target.value })}
				/>
			</Modal>
		);
	}

	_getPrice() {
		const validNames = this._getValidNames();
		const validLen = validNames.length;
		const qty = validLen % baseQty === 0 ? validLen : Math.floor(validLen / baseQty) * baseQty + baseQty;
		const price = qty * (baseQty / basePrice);
		return price;
	}

	_onClickAddDomain = () => {
		const domains = [
			...this.state.domains,
			createEmptyDomain()
		];
		this.setState({ domains });
		inBrowser && localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onClickRemoveDomain = (i) => {
		const domains = [
			...this.state.domains.slice(0, i),
			...this.state.domains.slice(i + 1),
		];
		this.setState({ domains });
		inBrowser && localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onChangeDomainName = (i, name) => {
		const domains = [
			...this.state.domains.slice(0, i),
			createDomain(name),
			...this.state.domains.slice(i + 1),
		];
		this.setState({ domains });
		inBrowser && localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onChangeEmail = (email) => {
		const emailHasError = email.length > 0 && !validateEmail(email);
		this.setState({ email, emailHasError });
		inBrowser && localStorage.setItem('email', JSON.stringify(email));
	}

	_getValidNames = () => {
		const map = _.indexBy(this.state.domains, 'validName');
		delete map[''];
		return Object.keys(map);
	}

	_onClickPay = async () => {
		if (!inBrowser) {
			return;
		};

		if (this.state.email.length === 0 || this.state.emailHasError) {
			notifyProblem('Problem', 'Please fix the problems in order to proceed');
			this.setState({ emailHasError: true });
			return;
		}

		for (let domain of this.state.domains) {
			if (domain.status === STATUS.INVALID || (domain.status === STATUS.MONITORED && domain.monitoredByEmail === this.state.email)) {
				notifyProblem('Problem', 'Please fix the problems in order to proceed');
				return;
			}
		}

		const validNames = this._getValidNames();
		if (validNames.length === 0) {
			notifyProblem('Problem', 'Please write down some domains');
			return;
		}

		this.setState({ loading: true });

		const hide = message.loading('This may take a while, please be patient...', 0);
		const precheckoutResponse = await fetch('/api/precheckout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				names: validNames,
				email: this.state.email,
			}),
		}).then(response => response.json());
		hide();

		if (precheckoutResponse.ok !== true) {
			notifyProblem('Problem', 'There was a problem');
			this.setState({ loading: false });
			return;
		}

		const resultByName = precheckoutResponse.result || {};

		let hasError = false;
		const domains = [...this.state.domains];
		for (let domain of domains) {
			if (domain.validName.length > 0) {
				if (resultByName[domain.validName] === 'invalid') {
					domain.status = STATUS.INVALID;
					hasError = true;
				} else if (resultByName[domain.validName] === 'monitored') {
					domain.status = STATUS.MONITORED;
					domain.monitoredByEmail = this.state.email;
					hasError = true;
				}
			}
		}

		if (hasError) {
			notifyProblem('Problem', 'Please fix the problems in order to proceed');
			this.setState({ loading: false, domains });
			return;
		}

		const checkout_id = uuidv4();

		// Paddle.Checkout.open({
		// 	product: 525713,
		// 	quantity: monitorNames.length,
		// 	email,
		// 	passthrough: checkout_id,
		// 	successCallback: (data) => {
		const postcheckoutResponse = await fetch('/api/postcheckout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				names: validNames,
				email: this.state.email,
				checkout_id: checkout_id,
				paddle_response: JSON.stringify({})
			}),
		}).then(response => response.json());

		if (postcheckoutResponse.ok !== true) {
			notifyProblem('Problem', 'There was a problem');
			this.setState({ loading: false });
			return;
		}
		// }
		// });

		notifySuccess('Thank you for using our service!', `You will receive monthly reports at ${this.state.email}`);
		this.setState(createInitialState());
		localStorage.clear();
		window.scrollTo(0, 0);
	}
}

function createInitialState() {
	const domains = [];
	for (let i = 0; i < 10; i++) {
		domains.push(createEmptyDomain());
	}

	return {
		loading: false,
		domains,
		email: '',
		emailHasError: false,
		bulkModalVisible: false,
		bulkModalLines: '',
	};
}

const STATUS = {
	EMPTY: 0,
	VALID: 1,
	INVALID: 2,
	MONITORED: 3,
}

function createEmptyDomain() {
	return { name: '', validName: '', status: STATUS.EMPTY, monitoredByEmail: '' };
}

function createDomain(name) {
	const domain = {
		name: name,
		monitoredByEmail: '',
	};

	if (name.length === 0) {
		domain.validName = '';
		domain.status = STATUS.EMPTY;

	} else {
		const validName = psl.parse(name).domain;

		if (validName) {
			domain.validName = validName;
			domain.status = STATUS.VALID;

		} else {
			domain.validName = '';
			domain.status = STATUS.INVALID;

		}
	}

	return domain;
}

function formatPrice(price) {
	const priceStr = numeral(price).format(priceFormat);
	const tokens = priceStr.split('.');
	return (
		<span>
			<span>{tokens[0]}</span>
			{tokens.length === 2 && <span>.</span>}
			{tokens.length === 2 && <span style={{ fontSize: '0.9em' }}>{tokens[1]}</span>}
		</span>
	);
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function notify(title, description) {
	notification.open({
		message: title,
		description: description,
	});
}

function notifyProblem(title, description) {
	notification.open({
		style: { backgroundColor: '#FDEDEC' },
		message: title,
		description: description,
	});
}

function notifySuccess(title, description) {
	notification.open({
		style: { backgroundColor: '#EAFAF1' },
		message: title,
		description: description,
	});
}

export function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


export default withSiteData(Home)
