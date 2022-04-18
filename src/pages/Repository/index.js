import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

import {
	Container,
	Loading,
	BackButton,
	Owner,
	IssuesList,
	PageActions,
	FiltersList,
} from './styles';
import api from '../../services/api';

export default function Repository() {
	const { repository } = useParams();

	const [repo, setRepo] = useState({});
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState([
		{ state: 'all', label: 'All', active: true },
		{ state: 'open', label: 'Open', active: false },
		{ state: 'closed', label: 'Closed', active: false },
	]);
	const [filterIndex, setFilterIndex] = useState(0);

	useEffect(() => {
		async function load() {
			const [repositoryData, issuesData] = await Promise.all([
				api.get(`/repos/${repository}`),
				api.get(`/repos/${repository}/issues`, {
					params: {
						state: filters.find((f) => f.active).state,
						per_page: 5,
					},
				}),
			]);

			setRepo(repositoryData.data);
			setIssues(issuesData.data);
			setLoading(false);
		}

		load();
	}, []);

	useEffect(() => {
		async function loadIssue() {
			const response = await api.get(`/repos/${repository}/issues`, {
				params: {
					state: filters[filterIndex].state,
					page: page,
					per_page: 5,
				},
			});

			setIssues(response.data);
		}

		loadIssue();
	}, [page, repository, filters, filterIndex]);

	function handlePage(action) {
		setPage(action === 'back' ? page - 1 : page + 1);
	}

	function handleFilter(index) {
		setFilterIndex(index);
	}

	if (loading) {
		return (
			<Loading>
				<FaSpinner color="#FFF" size={50} />
			</Loading>
		);
	}

	return (
		<Container>
			<BackButton to="/">
				<FaArrowLeft color="#000" size={30} />
			</BackButton>
			<Owner>
				<img src={repo.owner.avatar_url} alt={repo.owner.login} />
				<h1>{repo.name}</h1>
				<p>{repo.description}</p>
			</Owner>

			<FiltersList active={filterIndex}>
				{filters.map((filter, index) => (
					<button
						type="button"
						key={filter.label}
						onClick={() => handleFilter(index)}
					>
						{filter.label}
					</button>
				))}
			</FiltersList>

			<IssuesList>
				{issues.map((issue) => (
					<li key={issue.id}>
						<img src={issue.user.avatar_url} alt={issue.user.login} />
						<div>
							<strong>
								<a href={issue.html_url}>{issue.title}</a>

								{issue.labels.map((label) => (
									<span key={label.id}>{label.name}</span>
								))}
							</strong>
							<p>{issue.user.login}</p>
						</div>
					</li>
				))}
			</IssuesList>

			<PageActions>
				<button
					type="button"
					onClick={() => handlePage('back')}
					disabled={page < 2}
				>
					Back
				</button>
				<button type="button" onClick={() => handlePage('next')}>
					Next
				</button>
			</PageActions>
		</Container>
	);
}
