package sgq.cmd;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import sgq.cmd.bean.Word;
import sgq.cmd.bean.WordSet;
import sgq.cmd.util.PMF;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opensymphony.xwork2.ActionSupport;


public class InitWordSetAction extends ActionSupport {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7273760748494707369L;
	
	private int step = 1;
	
	private String result;
	
	public String execute() throws JsonParseException, JsonMappingException, IOException {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		result = "";
		WordSet wordSet = new WordSet();
		wordSet.setName("标准日本语（初级）");
		wordSet.setDescription("标准日本语上下册的所有单词");
		if (step != 1){
			Query query = pm.newQuery(WordSet.class);
			@SuppressWarnings("unchecked")
			List<WordSet> wordSets = (List<WordSet>) query.execute();
			wordSet = wordSets.get(0);
		}
		ObjectMapper mapper = new ObjectMapper();
		@SuppressWarnings("unchecked")
		List<Map<String, Object>> words = mapper.readValue(new File("words.json"), List.class);
		Iterator<Map<String, Object>> iterator = words.iterator();
		int count = 0;
		int k = 200;
		try {
			while(iterator.hasNext()) {
				count ++;
				Map<String, Object> wordData = iterator.next();
				if (count < k * (step - 1 ) || count >= k * step) continue;
				Word word = new Word();
				word.setChinese((String) wordData.get("chinese"));
				word.setHiragana((String)wordData.get("hiragana"));
				word.setJapanese((String) wordData.get("japanese"));
				word.setType((String) wordData.get("type"));
				word.setLessonNo((int) wordData.get("lessonNo"));
				wordSet.addWord(word);
			}

			result += wordSet.getWords().size() + " words have been added to wordset " + wordSet.getName();
			if (step == 1)
				pm.makePersistent(wordSet);
		}
		finally {
			pm.flush();
			pm.close();
		}
		return SUCCESS;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public int getStep() {
		return step;
	}

	public void setStep(int step) {
		this.step = step;
	}
}
