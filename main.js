(function() {

	/**
	 * Set env vars
	 */
	const configs = {
		baseUrl: "https://slovnik.seznam.cz",
		href: "/ru/?q=",
		idForm: "panslovnik_form"
	};

	configs.url = `${configs.baseUrl}${configs.href}`;

	/**
	 * Close dialog form
	 */
	document.onclick = (e) => {
		form = $(`#${configs.idForm}`);
		if (form) form.remove();
	}

	/**
	 * Entry point. Set event on document
	 */
	document.ondblclick = (e) => {
		// if alt pressed
		if (!e.altKey) return;
		// Get selected text
		let text = getSelectedText();
		if (!text) return;

		// Get translate
		translate(text)
		.done((data) => {
			if (!data) return '';
			data = $(data);
			let info;

			// Parse response
			moreResults = data.find(".moreResults").html();
			info = data.find("#fastMeanings").html();

			if (!info) {
				if (!moreResults) {
					info = 'Перевод не обнаружен';
				} else {
					info = `<p>Неоднозначное определение:<p> ${moreResults}`;
				}
			}

			title = data.find('.hgroup h3');
			if (title && title[0]) {
				text = title[0].textContent.trim();
				text = `<a href="${configs.href}${text}" > ${text} </a>`;
			}

			// Show result in dialog form
			show(text, info, { left: e.pageX, top: e.pageY });
		});
	}

	/**
	 * Return html piece of translate
	 * @param {String} text 
	 */
	function translate(text) {
		// Get info from website
		const url = `${configs.url}${text}`;
		return $.get(url)
		// handle the error
		.fail((err) => {
			console.log(`Request is failed: ${err}`);
			return '';
		});
	};

	/**
	 * Set correct hrefs to a-tags
	 */
	function correctLinks() {
		$(`#${configs.idForm}`).find('a').each((i, a) => {
			let tag = $(a);
			tag.attr('href', `${configs.baseUrl}${tag.attr('href')}`);
			tag.attr('target', '_blank');
		});

		// //delete header
		// info.find('.blind').remove();
		// info.find('#backToTheTop').remove();
	}

	/**
	 * Returns selected text in the document
	 */
	function getSelectedText() {
		let text = '';
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection) {
			text = document.selection.createRange().text;
		}
		text = typeof text !== 'string' ? '' : text.trim();
		return text;
	}

	/**
	 * 
	 * @param {String} info HTML code of transate 
	 */
	function show(text, info, pos) {
		view =
		`<div id="${configs.idForm}">

			<div id="text">
				${text}
			</div>

		 	<div style="padding: 15px;">
				${info}
			</div>
		</div>`;

		$('body').append(view);

		// set correct hrefs
		correctLinks();

		$('#panslovnik_form')
			.css('left', pos.left)
			.css('top', pos.top)
			.show(600);
	}
	
})();

