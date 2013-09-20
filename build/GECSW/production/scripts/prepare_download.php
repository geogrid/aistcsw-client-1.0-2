<?php

include(dirname(__FILE__).'/AjaxProxy.php');

class PrepareDownloadProxy extends AjaxProxy {
    /**
     * Given the object's current settings, make a request to the given url
     *  using the cURL library
     * @param string $url The url to make the request to
     * @return string The full HTTP response
     */
    protected function _makeCurlRequest($url)
    {
        $curl_handle = curl_init($url);
        /**
         * Check to see if this is a POST request
         * @todo What should we do for PUTs? Others?
         */
        if ($this->_requestMethod === self::REQUEST_METHOD_POST) {
            curl_setopt($curl_handle, CURLOPT_POST, true);
            curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $this->_requestBody);
        }

        curl_setopt($curl_handle, CURLOPT_HEADER, FALSE);
        curl_setopt($curl_handle, CURLOPT_USERAGENT, $this->_requestUserAgent);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_handle, CURLOPT_NOBODY, true);

        curl_exec($curl_handle);
        $info = curl_getinfo($curl_handle);

        if(200 != $info['http_code']) {
            echo json_encode(array(
                'success' => false,
                'errors'  => array(
                    'url' => array('File not found.')
                )
            ));
        } else {
            echo json_encode(array(
                'success' => true,
                'data'    => array(
                    'url'       => $url,
                    'filename'  => basename($url),
                    'size'      => $info['download_content_length']
                )
            ));
        }
    }
}

/**
 * Here's the actual script part. Comment it out or remove it if you simply want
 *  the class' functionality
 */
$proxy = new PrepareDownloadProxy('');
$proxy->execute();
