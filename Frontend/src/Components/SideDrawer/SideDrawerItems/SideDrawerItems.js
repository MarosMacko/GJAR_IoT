import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
	{ name: 'Byt', number: 29 },
	{ name: 'Inf Kabinet', number: 53 },
	{ name: 'III.A', number: 61 },
	{ name: 'Kniznica', number: 70 },
	{ name: 'Aj 1', number: 71 },
	{ name: 'Nj 2', number: 77 },
	{ name: 'Bio kabinet', number: 83 },
	{ name: 'VI.OA', number: 84 }
];

const sideDrawerItems = (props) => (
	<React.Fragment>
		<div>1. poschodie</div>
		{items.map((item, index) => {
			let header = null;
			if (item.number === 29) {
				header = '2. poschodie';
			} else if (item.number === 77) {
				header = '3. poschodie';
			}
			return (
				<React.Fragment key={index}>
					<NavLink style={{ textDecoration: 'none' }} to="/">
						<li onClick={() => props.click(`${item.name} (${item.number})`, item.number)}>
							{item.name} ({item.number})
						</li>
					</NavLink>
					{header !== null ? <div>{header}</div> : null}
				</React.Fragment>
			);
		})}
		<NavLink style={{ textDecoration: 'none' }} to="/about-project">
			<div style={{ textDecoration: 'underline' }} onClick={props.aboutProjectClick}>
				O projekte
			</div>
		</NavLink>
	</React.Fragment>
);

export default sideDrawerItems;
