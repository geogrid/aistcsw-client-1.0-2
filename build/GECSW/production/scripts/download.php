<?php

include(dirname(__FILE__).'/AjaxProxy.php');

class DownloadProxy extends AjaxProxy {
    /**
     * Given the object's current settings, make a request to the given url
     *  using the cURL library
     * @param string $url The url to make the request to
     * @return string The full HTTP response
     */
    protected function _makeCurlRequest($url)
    {
        $curl_handle = curl_init($url);
        curl_setopt($curl_handle, CURLOPT_HEADER, FALSE);
        curl_setopt($curl_handle, CURLOPT_USERAGENT, $this->_requestUserAgent);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_handle, CURLOPT_NOBODY, true);
        curl_exec($curl_handle);
        $info = curl_getinfo($curl_handle);

        if($info['http_code'] != 200) {
            header('status: ', $info['http_code']);
        } else {
            curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, false);
            curl_setopt($curl_handle, CURLOPT_NOBODY, false);

            header('Content-Type: application/octet-stream');
            header('Content-Length:' . $info['download_content_length']);
            header('Content-Disposition: attachment; filename="' . basename($url) . '"');

            curl_exec($curl_handle);
        }
    }
}

/**
 * Here's the actual script part. Comment it out or remove it if you simply want
 *  the class' functionality
 */
$proxy = new DownloadProxy('');
$proxy->execute();
