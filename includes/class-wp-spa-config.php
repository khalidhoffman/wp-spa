<?php

class WP_Spa_Config{
	private $fields = array();
	private $saveDir = '/data/';
	private $filename = 'wp-spa.config.json';

	/**
	 * WP_Spa_Config constructor.
	 *
	 * @param array $fields
	 * @param array $options
	 */
	function __construct($fields, $options=array()) {
		if (isset($options['saveDir'])){
			$this->saveDir = $options['saveDir'];
		}
		if (isset($options['filename'])){
			$this->filename = $options['filename'];
		}
		$this->fields = $fields;
	}

	public function save(){
		$data_dir = dirname(__DIR__ . '../') . $this->saveDir;
		if(!file_exists($data_dir)) {
			mkdir($data_dir);
		}
		$location = $data_dir . $this->filename;
		$fp = fopen($location, 'w');
		fwrite($fp, json_encode($this->fields));
		fclose($fp);
	}
}
