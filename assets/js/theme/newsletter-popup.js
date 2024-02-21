export default function (t, ev) {

   function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
   }

   function getCookie(cname) {
      const name = cname + '=';
      const ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) === ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
         }
      }
      return '';
   }

   const deleteCookie = function(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   };

   if ((ev === true) && (getCookie('epicNewsletterPopup') === '')) {
      setTimeout(function() {
         $('#epic-newsletter-popup').removeClass('d-none').addClass('fade-in');
         $('body').addClass('has-newsletter');
      }, 2000);

      $('#popupNewsletterForm').submit(function(event) {
         if ($('#popupNewsletterForm').find('#nl_email').val() === '') {
            alert('Please enter you Email Address!');
            return false;
         } else {
            setCookie('epicNewsletterPopup', 'closed', t);

            $('#epic-newsletter-popup').addClass('fade-out');
            setTimeout(function() {
               $('#epic-newsletter-popup').addClass('d-none');
               $('body').removeClass('has-newsletter');
               return true;
            }, 600);
         }
      });

      function setClosePopup() {
         setCookie('epicNewsletterPopup', 'closed', t);
         $('#epic-newsletter-popup').addClass('fade-out');
         setTimeout(function() {
            $('#epic-newsletter-popup').addClass('d-none');
            $('body').removeClass('has-newsletter');
         }, 600);
      }

      $(document).on('click', '[data-close-newsletter-popup]', function() {
         setClosePopup();
      });

      $(document).keyup(function(e) {
         if (e.keyCode === 27) { 
            setClosePopup();
         }
      });
   }

   if (ev === false) {
      deleteCookie('epicNewsletterPopup');
   }
}
