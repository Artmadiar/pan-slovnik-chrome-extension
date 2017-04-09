(function() {

	document.ondblclick = function(e) {
		if (e.altKey) {
			var text = getSelectedText();
			text = typeof text !== 'string' ? '' : text.trim();
			if (text !== '') {
				translateText(text);
			}
		}
	}

	function translateText(text) {
		if (text === '') {
			return;
		}
		var url = "https://slovnik.seznam.cz/ru/?q=" + text;
		// GET REQUEST
		$.get(url, function(data) {
			var info = $(data).find("#results");
			info = setStyleAndAttrs(info);
			// wrap to modal div
			info = '<div class="modal" id="slovnikExtension" style="z-index: 3000;">' + info.html() + '</div>';
		  $(info).appendTo('body').modal({ closeText: ''});
		});
	};

	// FORMALIZATION
	function setStyleAndAttrs(info) {
		//delete header
		info.find('.blind').remove();
		info.find('#backToTheTop').remove();

		//correct domain name of links
		info.find('a').each(function(i, el) {
			var a = $(el);
			a.attr('target', '_blank');
			a.attr('href', 'https://slovnik.seznam.cz' + a.attr('href'));
		});
		return info;
	}

	var getSelectedText = function() {
		var text = '';
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection) {
			text = document.selection.createRange().text;
		}
		return text;
	}

})();

